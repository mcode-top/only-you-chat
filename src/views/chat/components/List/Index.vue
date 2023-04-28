<template>
  <div class="chat-contact">
    <!-- 控制栏 -->
    <div class="chat-contact-control">
      <el-input
        v-model="chatStore.$state.globalSearch"
        placeholder="搜索内容"
        style="padding: 0 25px"
        clearable
      >
        <template #append>
          <el-button :icon="Search" size="small" @click="chatStore.handleGlobalSearch" />
        </template>
      </el-input>
    </div>
    <!-- 内容栏 -->
    <div class="chat-contact-content">
      <notification-list />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores';
import { Search } from '@element-plus/icons-vue';
import NotificationList from './NotificationList.vue';
const chatStore = useChatStore();
</script>
<style lang="scss" scoped>
.chat-contact {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-control {
    background-color: white;
    height: 60px;
    width: 100%;
    flex-shrink: 0;
    line-height: 60px;
  }
  &-content {
    width: 100%;
    flex-grow: 1;
    background-color: #f5f5f5;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
