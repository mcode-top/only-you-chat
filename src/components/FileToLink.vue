<!-- 文件类型转换下载链接 -->
<template>
  <a :href="src" class="file-link" :title="`${props.filename}\n${props.filetype}\n${zhSize}`">
    <div class="file-link-icon">
      <el-icon :size="60"><Document /></el-icon>
    </div>
    <div class="file-link-info">
      <div class="file-link-name">{{ props.filename }}</div>
      <div class="file-link-size">{{ props.filetype }}</div>
      <div class="file-link-size">{{ zhSize }}</div>
    </div>
  </a>
</template>
<script setup lang="ts">
import { computed, onUnmounted, ref, useAttrs, watch } from 'vue';
import { Document } from '@element-plus/icons-vue';
import { freeMedia, transformFileSize } from '@/utils';
const props = defineProps<{
  file?: File | String;
  filetype: string;
  filename: string;
  filesize: number;
}>();
const src = ref('');
const zhSize = computed(() => transformFileSize(props.filesize));
watch(
  () => props.file,
  (newValue) => {
    if (newValue instanceof File) {
      src.value = URL.createObjectURL(newValue);
    } else if (typeof newValue === 'string') {
      src.value = newValue;
    } else {
      src.value = '';
    }
  },
  {
    immediate: true
  }
);
onUnmounted(() => {
  freeMedia(src.value);
});
watch(src, (newValue, oldValue) => {
  freeMedia(oldValue);
});
</script>
<style lang="scss">
.file-link {
  display: flex;
  width: 250px;
  height: 80px;
  background-color: #ffffff;
  color: #303133;
  border: 1px solid rgba($color: #000, $alpha: 0.3);
  text-decoration: none;
  &-icon {
    width: 70px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
  }
  &-info {
    width: 180px;
    height: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &-name {
    color: #409eff;

    width: 100%;
    padding-left: 5px;
    text-align: left;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 20px;
    color: #000;
  }
  &-size {
    color: #303133;
    height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 5px;
    font-size: 12px;
    text-align: left;
  }
}
</style>
