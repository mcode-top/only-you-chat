<template>
  <div class="chat-layout">
    <div class="chat-layout-tools"><tools /></div>
    <div class="chat-layout-list"><list /></div>
    <div class="chat-layout-room"><room /></div>
  </div>
</template>
<script setup lang="ts">
import Tools from './Tools/Index.vue';
import List from './List/Index.vue';
import Room from './Room/Index.vue';
</script>
<style lang="scss">
.el-avatar {
  --el-avatar-bg-color: var(--el-color-white);
}
.chat-layout {
  width: 100%;
  height: 100%;
  display: flex;
  &-tools {
    flex-shrink: 0;
    height: 100%;
    width: 60px;
    background-color: #2e2e2e;
  }
  &-list {
    width: 240px;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
  }
  &-room {
    height: 100%;
    flex-grow: 1;
  }
}
</style>
