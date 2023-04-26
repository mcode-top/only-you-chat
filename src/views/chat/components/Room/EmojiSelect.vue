<!-- emjio选择框 -->
<template>
  <Teleport to="#app">
    <div
      v-show="props.visible"
      @click="handleCloseEmojo"
      style="position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; z-index: 1"
    ></div>
  </Teleport>
  <div class="emoji-list" v-if="props.visible">
    <div class="emoji-list-items default-scrollbar">
      <div v-for="emoji in EmojiList" :key="emoji" @click="handleChange(emoji)">
        {{ emoji }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EmojiList } from '@/utils/emoji';
import { defineEmits } from 'vue';
// const emit = defineEmits(['change', 'update:visible']);
const emit = defineEmits<{
  (e: 'change', emoji: string): void;
  (e: 'update:visible', visible: boolean): void;
}>();
const props = defineProps<{
  visible: boolean;
}>();
function handleChange(emoji: string) {
  emit('change', emoji);
}
function handleCloseEmojo() {
  emit('update:visible', false);
}
</script>

<style lang="scss" scoped>
.emoji-list {
  position: absolute;
  width: 380px;
  height: 190px;
  z-index: 999;
  top: -190px;
  left: 5px;

  .emoji-list-items {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 0 2px rgba(123, 123, 123, 0.17);
    display: grid;
    font-size: 18px;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;

    div {
      cursor: pointer;
      text-align: center;
      padding: 5px 0;

      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>
