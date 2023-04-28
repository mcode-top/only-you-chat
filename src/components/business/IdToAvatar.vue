<!-- 通过ID获取头像信息 -->

<template>
  <el-avatar v-bind="attrs" :src="src"></el-avatar>
</template>

<script setup lang="ts">
import { useUserStore, useChatStore } from '@/stores';
import type { ChatNotificationListItemType } from '@/types';
import { ref, useAttrs, watch } from 'vue';

const props = defineProps<{
  id: number;
  type?: ChatNotificationListItemType;
}>();
const attrs = useAttrs();
const src = ref('');
const chatStore = useChatStore();
const userStore = useUserStore();
watch(
  props,
  () => {
    if (!props.type || props.type === 'personal') {
      if (props.id === userStore.$state.info.id) {
        src.value = userStore.info.avatar;
      } else {
        chatStore.getFriendsInfo(props.id).then((res) => {
          src.value = res!.avatar;
        });
      }
    }
  },
  { immediate: true }
);
</script>
