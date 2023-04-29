<template>
  <div class="room-friend-card" v-if="chatStore.$state.currentContact">
    <friend-card :value="chatStore.$state.currentContact" />
    <el-button
      type="success"
      @click="
        chatStore.switchMessageRoom({
          id: chatStore.$state.currentContact.id,
          type: chatStore.$state.currentContact.type
        })
      "
      >进入聊天</el-button
    >
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores';
import FriendCard from '@/views/chat/components/card/FriendCard.vue';
const chatStore = useChatStore();
</script>
<style lang="scss">
.room-friend-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}
</style>
