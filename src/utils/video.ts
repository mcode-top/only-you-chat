/**@name 获取视频第一帧图片 */
export async function getVideoFristFarmeImage(url: string, filetype: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvasDOM = document.createElement('canvas');

    const ctx = canvasDOM.getContext('2d');
    const videoDOM = document.createElement('video');
    if (videoDOM.canPlayType(filetype) !== 'maybe') {
      reject('不支持的视频格式');
    }
    videoDOM.src = url;
    videoDOM.muted = true;
    // 允许使用其他域的视频 #https://blog.csdn.net/sai739295732/article/details/78475821
    videoDOM.crossOrigin = 'anonymous';
    videoDOM.currentTime = 0.1;

    videoDOM.onloadeddata = function (e) {
      // 视频加载成功后不能马上获取到帧数据
      // 参考文章 https://juejin.cn/post/6844903933631004679
      setTimeout(() => {
        canvasDOM.width = videoDOM.videoWidth;
        canvasDOM.height = videoDOM.videoHeight;
        try {
          ctx?.drawImage(videoDOM, 0, 0, videoDOM.videoWidth, videoDOM.videoHeight);
          canvasDOM.remove();
          videoDOM.remove();
          resolve(canvasDOM.toDataURL('image/webp'));
        } catch (error) {
          reject(error);
        }
      }, 100);
    };
    videoDOM.onerror = (e) => {
      console.error(e, '视频加载失败');

      reject(e);
    };
  });
}
/**@name 打开视频 */
export function openNewBrowserTag(file: string | Blob) {
  let src = '';
  if (file instanceof Blob) {
    src = URL.createObjectURL(file);
  } else if (typeof file === 'string') {
    src = file;
  } else {
    src = file;
  }
  window.open(src);
  return src;
}
