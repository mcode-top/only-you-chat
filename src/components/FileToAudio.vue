<!-- 文件转换为音频 -->
<template>
  <audio controls :autoplay="false">
    <source :src="src" :type="props.filetype" />
    <file-to-link
      :filetype="props.filetype"
      :filename="props.filename"
      :filesize="props.filesize"
      :file="src"
    />
  </audio>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { freeMedia } from '@/utils';
import FileToLink from './FileToLink.vue';
const props = defineProps<{
  audio?: String | File;
  filetype: string;
  filename: string;
  filesize: number;
}>();

const src = ref('');
watch(
  () => props.audio,
  (newValue) => {
    if (newValue instanceof File) {
      src.value = URL.createObjectURL(newValue);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  freeMedia(src.value);
});
watch(src, (newValue, oldValue) => {
  freeMedia(oldValue);
});
</script>
