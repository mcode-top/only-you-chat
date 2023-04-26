<!-- 文件转图片 -->
<template>
  <el-avatar v-bind="attrs" :src="src"></el-avatar>
</template>
<script setup lang="ts">
import { ref, useAttrs, watch } from 'vue';
import type { ElAvatar } from 'element-plus';
const attrs = useAttrs();
const props = defineProps<{
  image?: File | String;
}>();

const src = ref('');
watch(
  () => props.image,
  (newValue) => {
    if (newValue instanceof File) {
      const img = new FileReader();
      img.onload = () => {
        if (typeof img.result === 'string') {
          src.value = img.result;
        } else {
          src.value = '';
        }
      };
      img.readAsDataURL(newValue);
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
</script>
