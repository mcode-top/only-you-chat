<!-- 发送语音消息 -->
<template>
  <ElPopover
    trigger="click"
    placement="top"
    :visible="visible"
    :width="300"
    @update:visible="(v) => (visible = v)"
  >
    <div>
      <MiddlefrequencyChat
        v-if="!audioFile"
        class="audio-box"
        :bar-total="recorder.analyserNode?.frequencyBinCount || 0"
        :frequency-data="frequencyData"
      />
      <FileToAudio
        v-else
        class="audio-box"
        :filetype="audioFile.type"
        :filesize="audioFile.size"
        :filename="audioFile.name"
        :audio="audioFile"
      />
    </div>
    <div class="audio-status border-top border-bottom">
      <div class="audio-status-text">录音状态:{{ statusZh }}</div>
      <div class="audio-status-time">记录时间:{{ recorderTimeZh }}</div>
    </div>
    <ElRow>
      <ElTooltip :content="status === 'pause' ? '继续' : '录音'">
        <ElCol :span="4" class="flex-middle">
          <ElButton
            :disabled="status === 'recording'"
            @click="handleRecord"
            :icon="Mic"
            circle
          ></ElButton>
        </ElCol>
      </ElTooltip>
      <ElTooltip :content="'暂停'">
        <ElCol :span="4" class="flex-middle">
          <ElButton
            @click="handlePause"
            :disabled="status === 'stop' || status === 'pause'"
            :icon="VideoPause"
            circle
          ></ElButton>
        </ElCol>
      </ElTooltip>
      <ElTooltip :content="'停止'">
        <ElCol :span="4" class="flex-middle">
          <ElButton
            @click="handleStop"
            :disabled="status === 'stop'"
            :icon="Check"
            circle
          ></ElButton>
        </ElCol>
      </ElTooltip>
      <ElCol :span="6" class="flex-middle">
        <ElButton size="small" type="primary" @click="handleOk">发送</ElButton>
      </ElCol>
      <ElCol :span="6" class="flex-middle">
        <ElButton size="small" @click="handleCancel">关闭</ElButton>
      </ElCol>
    </ElRow>

    <template #reference>
      <slot></slot>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, shallowRef, watch } from 'vue';
import { ElMessage, ElPopover } from 'element-plus';
import { useChatStore } from '@/stores/chat';
import EasyRecorder from '@/utils/easyRecorder';
import MiddlefrequencyChat from '@/components/business/MiddlefrequencyChat.vue';
import FileToAudio from '@/components/FileToAudio.vue';
import { Mic, VideoPause, Check, Close } from '@element-plus/icons-vue';
import moment from 'moment';
import { blobToFile } from '@/utils';
// 录制状态 recording 录制中 pause 暂停 stop 停止
type RecordStatus = 'recording' | 'pause' | 'stop';
const emit = defineEmits<{
  (e: 'change', file: File): void;
}>();
const visible = ref(false);
const audioFile = shallowRef<File>();
// 录制状态
const status = ref<RecordStatus>('stop');
const statusZh = computed(() => {
  switch (status.value) {
    case 'recording':
      return '录音中';
    case 'pause':
      return '暂停';
    case 'stop':
      return '停止';
    default:
      return '未知';
  }
});
const recorder = new EasyRecorder();
// 录制时间
const recorderTime = ref(0);
const recorderTimeZh = computed(() => {
  return moment(recorderTime.value * 1000).format('mm:ss');
});
// 频谱数据
const frequencyData = shallowRef<Uint8Array | undefined>();
// 当前录音
let currentMediaRecord: MediaRecorder | null = null;
// 绘制频谱
function startDraw() {
  toDraw();
  function toDraw() {
    if (recorder.audioContext !== null) {
      requestAnimationFrame(toDraw);
      frequencyData.value = recorder.getByteFrequencyData();
    }
  }
}
// 点击录制按钮
function handleRecord() {
  if (status.value === 'pause') {
    currentMediaRecord?.resume();
    status.value = 'recording';
  } else if (status.value === 'recording') {
    ElMessage.warning('已经开始录音了');
  } else if (status.value === 'stop') {
    currentMediaRecord = recorder.startRecord(handleRecordedCompleted);
    audioFile.value = undefined;
    status.value = 'recording';
  }
}
// 点击暂停按钮
function handlePause() {
  if (status.value === 'recording') {
    currentMediaRecord?.pause();
    status.value = 'pause';
  } else if (status.value === 'pause') {
    ElMessage.warning('已经暂停了');
  } else if (status.value === 'stop') {
    ElMessage.warning('还未开始录音');
  }
}
// 点击停止按钮
function handleStop() {
  if (status.value === 'recording' || status.value === 'pause') {
    currentMediaRecord?.stop();
    status.value = 'stop';
  } else if (status.value === 'stop') {
    ElMessage.warning('还未开始录音');
  }
}
let timer: number = 0;
// 开始计时
function startTime(reset = true) {
  if (reset) {
    recorderTime.value = 0;
    timer = setInterval(() => {
      if (status.value !== 'pause') {
        recorderTime.value++;
      }
    }, 1000);
  }
}
// 停止计时
function stopTime() {
  clearInterval(timer);
}
// 点击发送按钮
async function handleOk() {
  if (status.value === 'recording' || status.value === 'pause') {
    handleStop();
    const timeout = setTimeout(() => {
      visible.value = false;
      ElMessage.warning('发送录音超时');
    }, 5000);
    const closeWacth = watch(
      audioFile,
      (newValue) => {
        if (newValue) {
          clearTimeout(timeout);
          visible.value = false;
          closeWacth();
          emit('change', newValue);
        }
      },
      {
        flush: 'post'
      }
    );
    return;
  }
  visible.value = false;
  emit('change', audioFile.value!);
}
// 点击关闭按钮
function handleCancel() {
  visible.value = false;
}
// 初始化录音
function init() {
  recorder.init()?.then(() => {
    // recorder.start();
    startDraw();
    // 初始化好自动开始录音
    handleRecord();
  });
}

// 录音已完成
function handleRecordedCompleted(err: Event | undefined, blob: Blob | undefined) {
  if (err) {
    ElMessage.error('录音失败');
    throw new Error(err.toString());
  }
  if (blob) {
    audioFile.value = blobToFile(blob, `${moment().format('YYMMDDHHmmsss')}.webm`, 'audio/webm');
  }
  currentMediaRecord = null;
}

watch(visible, (newValue) => {
  // 默认打开的时候就开始录音了
  if (newValue) {
    init();
  } else {
    audioFile.value = undefined;
    recorderTime.value = 0;
    stopTime();
    audioFile.value = undefined;
    frequencyData.value = undefined;
    currentMediaRecord = null;
    recorder.close();
  }
});
watch(status, (newValue, oldValue) => {
  // 监听录音状态来控制时间
  if (newValue === 'recording') {
    startTime(oldValue === 'stop');
  } else if (newValue === 'stop') {
    console.log('====================================');
    console.log(newValue);
    console.log('====================================');
    stopTime();
  }
});
</script>
<style lang="scss" scoped>
.audio-box {
  width: 100%;
  height: 80px;
}
.audio-status {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
  margin: 8px 0;
}
</style>
