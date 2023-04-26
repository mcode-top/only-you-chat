<template>
  <div id="chat">
    <chat-layout></chat-layout>
  </div>
</template>
<script setup lang="ts">
import ChatLayout from './components/ChatLayout.vue';
</script>
<style lang="scss" scoped>
#chat {
  width: 1000px;
  height: 690px;
  //   box-shadow: 0px 0px 30px #ccc;
  background-color: rgba($color: #ffffff, $alpha: 1);
  border-radius: 3px;
  overflow: hidden;
}
</style>
