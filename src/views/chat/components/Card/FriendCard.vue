<!-- 好友名片 -->
<template>
  <div class="friend-card">
    <div class="friend-card-avatar">
      <id-to-avatar shape="square" :size="100" :id="props.value.id" :type="props.value.type" />
    </div>
    <div class="friend-card-description border-top">
      <div class="friend-card-description-item" v-for="item in description" :key="item.key">
        <div class="friend-card-description-label">{{ item.label }}:</div>
        <div class="friend-card-description-value">
          {{
            !(props.value.type === 'group' && item.key === 'username')
              ? (props.value as FriendInfo)[item.key]
              : ''
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ContactInfo, FriendInfo } from '@/types';
import IdToAvatar from '@/components/business/IdToAvatar.vue';

const description = [
  {
    label: '昵称',
    key: 'name'
  },
  {
    label: '登录名',
    key: 'username'
  },
  {
    label: '备注名',
    key: 'remarkName'
  },
  {
    label: '添加时间',
    key: 'associatedAt'
  }
] as const;

const props = defineProps<{
  value: ContactInfo;
}>();
</script>

<style lang="scss" scoped>
.friend-card {
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 15px;
}
.friend-card-avatar {
  padding-bottom: 10px;
}
.friend-card-description {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}
.friend-card-description-item {
  width: 100%;
  display: flex;
  padding: 5px 0;
  align-items: center;
}
.friend-card-description-label {
  width: 80px;
  text-align: justify; /*两端对齐*/
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  padding-right: 10px;
  &::after {
    content: '';
    display: inline-block;
    width: 100%;
  }
}
.friend-card-description-value {
  height: 30px;
  line-height: 30px;
  flex-grow: 1;
  min-width: 0;
}
</style>
