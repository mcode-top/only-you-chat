<!-- 文件转视频 暂时仅支持mp4 -->
<template>
  <div class="video-box" @click="handleOpenPlay" v-if="support">
    <el-icon :size="60" class="video-play" :color="'#fefefe'"><VideoPlay /></el-icon>
    <el-avatar
      class="video-frame"
      v-bind="attrs"
      :src="props.videoCover || '/logo.png'"
    ></el-avatar>
  </div>

  <file-to-link
    v-else
    :filetype="props.filetype"
    :filename="props.filename"
    :filesize="props.filesize"
    :file="props.video"
  />
</template>
<script setup lang="ts">
import { computed, onUnmounted, ref, useAttrs, watch } from 'vue';
import type { ElAvatar } from 'element-plus';
import { VideoPlay } from '@element-plus/icons-vue';
import FileToLink from './FileToLink.vue';
import { openNewBrowserTag } from '@/utils';

const attrs = useAttrs();
const props = defineProps<{
  video?: File | string;
  filetype: string;
  filename: string;
  // 视频封面
  videoCover?: string;
  filesize?: number;
}>();
const support = computed(() => {
  return props.videoCover !== undefined;
});
function handleOpenPlay() {
  if (props.video) {
    openNewBrowserTag(props.video);
  }
}
openNewBrowserTag;
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
