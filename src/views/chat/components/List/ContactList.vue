<!-- 联系人列表 -->
<template>
  <div class="contact-list default-scrollbar">
    <div
      class="contact-item"
      :class="{ active: item.id === chatStore?.currentContact?.id }"
      v-for="item in charSortList"
      :key="item.id"
      @click="chatStore.switchContact(item)"
    >
      <div class="contact-item-avatar">
        <id-to-avatar shape="square" :size="45" :id="item.id" :type="item.type" />
      </div>
      <div class="contact-item-name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ContactInfo } from '@/types';
import { computed, reactive } from 'vue';
import IdToAvatar from '@/components/business/IdToAvatar.vue';
import { useChatStore } from '@/stores';
const chatStore = useChatStore();
const list = reactive<ContactInfo[]>([
  {
    type: 'personal',
    id: '1',
    name: '小张',
    avatar: '/logo.png',
    username: 'abcdefg',
    associatedAt: '2023-04-24 11:06:30',
    associatedStatus: 'friend'
  },
  {
    type: 'personal',
    id: '2',
    name: '小王',
    avatar: '/logo.png',
    username: 'abcdefg11',
    associatedAt: '2023-04-24 11:06:30',
    associatedStatus: 'friend'
  }
]);
const charSortList = computed(() => {
  return [...list].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});
</script>

<style lang="scss" scoped>
.contact-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow: hidden;
  .active {
    background-color: #ccc !important;
  }
  .contact-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
    &-avatar {
      margin-right: 10px;
    }
    &-name {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
