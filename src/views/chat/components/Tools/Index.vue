<template>
  <div class="chat-tools">
    <div class="chat-tools-avatar">
      <id-to-avatar shape="square" :size="40" :id="userStore.info.id" />
    </div>
    <div class="chat-tools-list">
      <div class="chat-tools-list-item" v-for="item in tools" :key="item.title" @click="item.click">
        <el-icon
          :size="uniIconSize"
          :color="item.type === chatStore.$state.currentType ? '#73d13d' : '#f5f5f5'"
        >
          <component :is="item.icon"></component>
        </el-icon>
      </div>
    </div>
    <div class="chat-tools-control">
      <el-icon :color="'#f5f5f5'" :size="uniIconSize"> <Setting /> </el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, shallowReactive } from 'vue';
import { useChatStore, useUserStore } from '@/stores';
import IdToAvatar from '@/components/business/IdToAvatar.vue';
import { UserFilled, Comment, Setting } from '@element-plus/icons-vue';
const userStore = useUserStore();
const chatStore = useChatStore();
const uniIconSize = 30;
const tools = [
  {
    icon: Comment,
    title: '聊天',
    type: 'chat',
    click: () => {
      ElMessage('聊天框');
      chatStore.setCurrentType('chat');
    }
  },
  {
    icon: UserFilled,
    title: '联系人',
    type: 'contact',
    click: () => {
      ElMessage('联系人');
      chatStore.setCurrentType('contact');
    }
  }
];
</script>
<style lang="scss" scoped>
.chat-tools {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &-avatar {
    padding-top: 35px;
    flex-shrink: 0;
  }
  &-list {
    padding-top: 20px;
    flex-grow: 1;
    &-item {
      width: 40px;
      height: 40px;
      border-radius: 5px;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  &-control {
    padding-top: 25px;
    padding-bottom: 10px;
    flex-shrink: 0;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
