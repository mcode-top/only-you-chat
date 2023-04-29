<template>
  <room-message v-if="chatStore.currentType === 'chat'" />
  <room-friend-card v-else-if="chatStore.currentType === 'contact'" />
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import RoomMessage from './RoomMessage/Index.vue';
import RoomFriendCard from './RoomFriendCard.vue';
const chatStore = useChatStore();
</script>
