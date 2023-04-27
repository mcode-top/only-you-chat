// 简单的封装一下浏览器录音功能 参考文章 https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API#audio_workers

interface EasyRecorderConfig {
  // 采集缓冲区大小 默认4096
  collectBufferSize: number;
  // 一次谱线的数量 默认256 用于提取频谱信息
  fftSize: number;
  // 音频的增益(音量大小) 默认1
  gainValue: number;
  // 可以听到自己的声音
  ownVoice: boolean;
}
// 报错怎么处理
export default class EasyRecorder extends EventTarget {
  audioContext: AudioContext | null = null;
  gainNode: GainNode | null = null;
  analyserNode: AnalyserNode | null = null;
  destinationNode: MediaStreamAudioDestinationNode | null = null;
  config: EasyRecorderConfig;
  scriptNode: ScriptProcessorNode | null = null;
  sourceNode: MediaStreamAudioSourceNode | null = null;
  constructor(config?: Partial<EasyRecorderConfig>) {
    super();
    this.config = {
      fftSize: 256,
      gainValue: 1,
      ownVoice: false,
      collectBufferSize: 4096,
      ...(config || {})
    };
  }
  init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return alert('浏览器不支持录音功能');
    }
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        EasyRecorder.EasyRecorderManager.add(this);
        // 创建一个音频上下文环境
        const audioContext = new AudioContext();
        // 输入的口子
        const sourceNode = audioContext.createMediaStreamSource(stream);
        // 音频的增益节点
        const gainNode = audioContext.createGain();
        // 控制音量大小
        gainNode.gain.value = this.config.gainValue;
        // 通过ScriptProcess来处理音频数据,默认采集缓冲区大小为4096,单声道输入单声道输出
        const scriptNode = audioContext.createScriptProcessor(this.config.collectBufferSize, 1, 1);
        // 提取频谱信息
        const analyserNode = audioContext.createAnalyser();
        // fftSize 为采样点的数量,默认为2048,范围为32-32768,且必须是2的幂次方
        analyserNode.fftSize = this.config.fftSize;
        // 创建一个播放源节点
        const destinationNode = audioContext.createMediaStreamDestination();
        sourceNode.connect(analyserNode);
        sourceNode.connect(scriptNode);
        sourceNode.connect(gainNode);

        // 连接增益节点到播放源节点
        gainNode.connect(destinationNode);
        scriptNode.connect(destinationNode);
        analyserNode.connect(destinationNode);
        scriptNode.onaudioprocess = (e) => {
          // 处理音频数据 如果音频的采样率为44.1KHz,采集缓冲区大小为4096 则会触发 44100/4096 = 10.77次audioprocess事件
          const inputData = e.inputBuffer.getChannelData(0);
          this.dispatchEvent(new CustomEvent('audioprocess', { detail: inputData as any }));
          if (this.config.ownVoice) {
            this.playerBuffer(inputData);
          }
        };
        // 初始化完毕暴露到类中
        this.audioContext = audioContext;
        this.gainNode = gainNode;
        this.analyserNode = analyserNode;
        this.destinationNode = destinationNode;
        this.scriptNode = scriptNode;
        this.sourceNode = sourceNode;
      })
      .catch((err) => {
        console.error(err);
        return alert('浏览器不支持录音功能');
      });
  }
  /**@name 获取波形频率谱图 */
  getFrequencyData(analyserNode: AnalyserNode = this.analyserNode!) {
    // 一次谱线的数量
    const data = new Float32Array(analyserNode.frequencyBinCount);
    // 将频率数据复制到data中
    analyserNode.getFloatFrequencyData(data);
    return data;
  }
  /**@name 获取波形频率谱图 */
  getByteFrequencyData(analyserNode: AnalyserNode = this.analyserNode!) {
    // 一次谱线的数量
    const data = new Uint8Array(analyserNode.frequencyBinCount);
    // 将频率数据复制到data中
    analyserNode.getByteFrequencyData(data);
    return data;
  }
  /**@name 获取波形时域图 */
  getTimeDomainData(analyserNode: AnalyserNode = this.analyserNode!) {
    // 一次谱线的数量
    const data = new Float32Array(analyserNode.frequencyBinCount);
    // 将频率数据复制到data中
    analyserNode.getFloatTimeDomainData(data);
    return data;
  }
  /**@name 播放ArrayBuffer音频流 */
  async playerBuffer(
    arrayBuffer: ArrayBuffer | Float32Array | AudioBuffer,
    volume: number = 1,
    audioContext: AudioContext = this.audioContext!,
    destinationNode: MediaStreamAudioDestinationNode = this.destinationNode!
  ) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    // 输出的口子
    const outputSourceNode = audioContext.createBufferSource();
    if (arrayBuffer instanceof ArrayBuffer) {
      // 解码将arrayBuffer转换为audioBuffer
      arrayBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } else if (arrayBuffer instanceof Float32Array) {
      arrayBuffer = this.float32ToAudioBuffer(arrayBuffer);
    }
    // 将buffer数据赋值给输出口子
    outputSourceNode.buffer = arrayBuffer;
    // 连接到增益节点中(相当于合并音轨)
    outputSourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(destinationNode);
    // 播放声音
    outputSourceNode.start();
    // 输出GainNode.gain.value用于控制音量,outputSourceNode.stop用于停止播放
    return { gainNode, outputSourceNode };
  }
  /**@name 设置音量 */
  setVolume(volume: number, gainNode: GainNode = this.gainNode!) {
    gainNode.gain.value = volume;
  }

  /**@name 开始录制声音 */
  startRecord(
    cb: (err: undefined | Event, blob?: Blob) => void,
    destinationNode: MediaStreamAudioDestinationNode = this.destinationNode!
  ) {
    // 此时增益节点中已经有了录音轨道和播放轨道,他们都在播放源中
    const mixedStream = destinationNode.stream;

    let mediaRecorder: MediaRecorder | null = new MediaRecorder(mixedStream, {
      mimeType: 'audio/webm; codecs=opus'
    });
    const tempChunks: Blob[] = [];
    // 定义录制完成的回调函数
    mediaRecorder.ondataavailable = (e) => {
      tempChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      // 将录制完成的数据保存为webm文件
      const blob = new Blob(tempChunks, { type: 'audio/webm; codecs=opus' });
      cb(undefined, blob);
      mediaRecorder = null;
    };
    mediaRecorder.onerror = (e) => {
      mediaRecorder!.stop();
      cb(e);
      mediaRecorder = null;
    };
    mediaRecorder.start();
    return mediaRecorder!;
  }
  /**@name 释放资源 */
  async close() {
    await this.audioContext?.close();
    EasyRecorder.EasyRecorderManager.delete(this);
    // 如果没有其他实例在使用,则关闭所有音轨
    if (EasyRecorder.useInstanceCount() === 0) {
      // 关闭所有音轨
      this.sourceNode?.mediaStream.getTracks().forEach((track) => track.stop());
    }

    this.audioContext = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.destinationNode = null;
    this.scriptNode = null;
    this.sourceNode = null;
  }
  //通过pcm音频数据计算分贝
  getDecibelByPcmData(pcmData: Float32Array) {
    let sum = 0;
    for (let i = 0; i < pcmData.length; i++) {
      sum += pcmData[i] * pcmData[i];
    }
    const rms = Math.sqrt(sum / pcmData.length);
    const db = 20 * Math.log10(rms);
    return db;
  }
  // Float32Array转换为AudioBuffer
  float32ToAudioBuffer(
    float32Array: Float32Array,
    audioContext: AudioContext = this.audioContext!
  ) {
    const audioBuffer = audioContext.createBuffer(1, float32Array.length, audioContext.sampleRate);
    audioBuffer.copyToChannel(float32Array, 0);
    return audioBuffer;
  }
  static EasyRecorderManager: Set<EasyRecorder> = new Set();
  /**@name 使用的实例数量 */
  static useInstanceCount() {
    return EasyRecorder.EasyRecorderManager.size;
  }
}
