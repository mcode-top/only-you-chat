<!-- 文件转视频 暂时仅支持mp4 -->
<template>
  <div class="video-box" @click="handleOpenPlay" v-if="support">
    <el-icon :size="60" class="video-play" :color="'#fefefe'"><VideoPlay /></el-icon>
    <el-avatar class="video-frame" v-bind="attrs" :src="frameSrc"></el-avatar>
  </div>

  <file-to-link
    v-else
    :filetype="props.filetype"
    :filename="props.filename"
    :filesize="props.filesize"
    :file="videoSrc"
  />
</template>
<script setup lang="ts">
import { onUnmounted, ref, useAttrs, watch } from 'vue';
import type { ElAvatar } from 'element-plus';
import { VideoPlay } from '@element-plus/icons-vue';
import { freeMedia } from '@/utils';
import FileToLink from './FileToLink.vue';

const attrs = useAttrs();
const props = defineProps<{
  video?: File | String;
  filetype: string;
  filename: string;
  filesize: number;
}>();
const videoSrc = ref('');
const frameSrc = ref('');
const support = ref(true);
function handleOpenPlay() {
  openPlay(videoSrc.value);
}
function openPlay(url: string) {
  window.open(url);
}
/**@name 获取视频的帧 */
function getVideoFrame(video: string) {
  const canvasDOM = document.createElement('canvas');

  const ctx = canvasDOM.getContext('2d');
  const videoDOM = document.createElement('video');
  if (videoDOM.canPlayType(props.filetype) !== 'maybe') {
    support.value = false;
    return;
  }
  support.value = true;
  videoDOM.src = video;
  videoDOM.muted = true;
  videoDOM.onloadeddata = async function (e) {
    // 视频加载成功后不能马上获取到帧数据
    // 参考文章 https://juejin.cn/post/6844903933631004679
    await videoDOM.play();
    setTimeout(() => {
      canvasDOM.width = videoDOM.videoWidth;
      canvasDOM.height = videoDOM.videoHeight;
      ctx?.drawImage(videoDOM, 0, 0, videoDOM.videoWidth, videoDOM.videoHeight);
      frameSrc.value = canvasDOM.toDataURL('image/jpeg');
    }, 100);
  };
}
watch(
  () => props.video,
  (newValue) => {
    if (newValue instanceof File) {
      videoSrc.value = URL.createObjectURL(newValue);
      getVideoFrame(videoSrc.value);
    } else if (typeof newValue === 'string') {
      getVideoFrame(newValue);
    } else {
      videoSrc.value = '';
      frameSrc.value = '';
    }
  },
  {
    immediate: true
  }
);

onUnmounted(() => {
  freeMedia(frameSrc.value);
});
watch(frameSrc, (newValue, oldValue) => {
  freeMedia(oldValue);
});
</script>
<style lang="scss">
.video-box {
  position: relative;
  cursor: pointer;
  &:hover .video-play {
    box-shadow: 0 0 5px #fff;
  }
}
.video-play {
  position: absolute;
  z-index: 50;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  transition: all 0.3s;
  box-shadow: 0 0 5px #000;
  border-radius: 10000px;
}
.video-frame {
  opacity: 1;
}
</style>
