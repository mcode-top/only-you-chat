<template>
  <div class="chat-list default-scrollbar">
    <div
      class="chat-item"
      :class="activeRoom(item) ? 'chat-item-active' : ''"
      v-for="item in notificationList"
      :key="item.type + item.id"
      @click="chatStore.switchMessageRoom(item)"
    >
      <div class="chat-avatar">
        <el-badge :is-dot="item.unreadCount > 0" type="danger">
          <id-to-avatar shape="square" :size="35" :id="item.id" :type="item.type" />
        </el-badge>
      </div>
      <div class="chat-info">
        <div class="chat-title">
          {{ item.name }}
        </div>
        <div class="chat-message">
          {{ parseSendmessageType(item.sendType, item.lastMessage) }}
        </div>
      </div>
      <div class="chat-time">
        <div class="chat-title">
          {{ pareseLastMessageDate(item.updatedAt) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ChatNotificationListItem } from '@/types';
import { reactive, watch } from 'vue';
import { useChatStore } from '@/stores';
import { pareseLastMessageDate, parseSendmessageType } from '@/views/chat/helper';
import IdToAvatar from '@/components/business/IdToAvatar.vue';

const chatStore = useChatStore();
const notificationList = reactive<ChatNotificationListItem[]>([
  {
    name: '测试消息',
    lastMessage: 'Helloasdas感豆腐干豆腐干Helo',
    updatedAt: '2023-04-24 11:06:30',
    avatar: '/logo.png',
    type: 'personal',
    sendType: 'text',
    id: '1',
    unreadCount: 1
  },
  {
    name: '测试消息',
    lastMessage: 'Helloasdas感豆腐干豆腐干Helo',
    updatedAt: '2023-04-23 11:06:30',
    avatar: '/logo.png',
    type: 'personal',
    sendType: 'image',
    id: '2',
    unreadCount: 2
  },
  {
    name: '测试消息',
    lastMessage: 'Helloasdas感豆腐干豆腐干Helo',
    updatedAt: '2023-02-02 11:06:30',
    avatar: '/logo.png',
    type: 'personal',
    sendType: 'text',
    id: '3',
    unreadCount: 1
  }
]);
watch(
  () => notificationList,
  (newValue) => {
    if (newValue.length > 0 && !chatStore.$state.currentRoom) {
      chatStore.switchMessageRoom(newValue[0]);
    }
  },
  { immediate: true }
);

function activeRoom(item: ChatNotificationListItem) {
  if (chatStore.$state.currentRoom) {
    return (
      item.type + item.id ===
      chatStore.$state?.currentRoom?.type + chatStore.$state?.currentRoom?.id
    );
  } else {
    return false;
  }
}
</script>
<style lang="scss" scoped>
.chat-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .chat-item-active {
    background-color: #ccc !important;
  }
  .chat-item {
    cursor: pointer;
    user-select: none;
    min-height: 50px;
    padding: 10px 0 10px 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    &:hover {
      background-color: #eee;
    }
    .chat-avatar {
      flex-shrink: 0;
    }
    .chat-info {
      font-size: 14px;
      flex-grow: 1;
      padding: 0 10px;
      min-width: 0;
      .chat-title {
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
      }

      .chat-message {
        margin-top: 5px;
        font-size: 12px;

        color: rgba($color: #000000, $alpha: 0.5);
        white-space: nowrap;
        clear: both;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .chat-time {
      text-align: right;
      font-size: 12px;
      color: #757575;
      flex-shrink: 0;
      padding-right: 5px;
      width: 60px;
    }
  }
}
</style>
