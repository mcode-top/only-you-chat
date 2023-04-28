<!-- 消息内容 -->
<template>
  <div class="chat-content default-scrollbar" ref="chatContentRef">
    <div v-for="(item, index) in props.list" :key="index" class="chat-item">
      <!-- 时间块 -->
      <span class="message-create-time" v-if="item.sendAt">{{ item.sendAt }}</span>
      <div :class="item.isMy ? 'self' : 'other'">
        <!-- 头像块 -->
        <div class="avatar">
          <id-to-avatar
            :shape="'square'"
            :id="item.isMy ? userStore.$state.info.id : item.id!"
          ></id-to-avatar>
        </div>
        <!-- 消息块 -->
        <div class="chat-bubble chat-bubble-style" style="white-space: pre-wrap">
          <div v-if="item.sendMessageType === 'text'" style="text-align: left">
            {{ item.message }}
          </div>
          <div v-else-if="item.sendMessageType === 'image'">
            <file-to-image
              @click="() => handleImageClick(index)"
              :data-index="index"
              class="send-message-image"
              :shape="'square'"
              :fit="'contain'"
              :size="200"
              :image="item.message"
              :filesize="item.filesize!"
            ></file-to-image>
          </div>
          <div v-else-if="item.sendMessageType === 'video'">
            <file-to-video
              :data-index="index"
              :shape="'square'"
              :fit="'contain'"
              :size="200"
              :filetype="item.filetype!"
              :filesize="item.filesize!"
              :video="item.message"
              :filename="item.filename!"
              :video-cover="item.videoCover"
            ></file-to-video>
          </div>
          <div v-else-if="item.sendMessageType === 'audio'">
            <file-to-audio
              :audio="item.message"
              :filetype="item.filetype!"
              :filesize="item.filesize!"
              :filename="item.filename!"
              style="width: 300px; height: 40px"
            ></file-to-audio>
          </div>
          <div v-else-if="item.sendMessageType === 'file'">
            <file-to-link
              :filesize="item.filesize!"
              :filename="item.filename!"
              :file="item.message"
              :filetype="item.filetype!"
            ></file-to-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#app">
    <div v-show="reviewrVisible">
      <el-image-viewer
        :url-list="imageList.map((i) => i.src)"
        @close="() => (reviewrVisible = false)"
        ref="reviewrRef"
      ></el-image-viewer>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import type { ChatMessageSendContent } from '@/types';
import { withDefaults, defineProps, ref, watch, nextTick, reactive } from 'vue';
import IdToAvatar from '@/components/business/IdToAvatar.vue';
import FileToImage from '@/components/FileReader/FileToImage.vue';
import FileToVideo from '@/components/FileReader/FileToVideo.vue';
import FileToAudio from '@/components/FileReader/FileToAudio.vue';
import FileToLink from '@/components/FileReader/FileToLink.vue';
import type { ElImageViewer } from 'element-plus';
const userStore = useUserStore();
const reviewrRef = ref<InstanceType<typeof ElImageViewer> | null>(null);
const reviewrVisible = ref(false);
const imageList = ref<{ src: string; index: number }[]>([]);

const chatContentRef = ref<HTMLDivElement | null>(null);
const props = withDefaults(
  defineProps<{
    list: ChatMessageSendContent[];
  }>(),
  {
    list: () => []
  }
);
/**@name 生成图片列表 */
function makeImageList() {
  if (chatContentRef.value) {
    const list: HTMLImageElement[] = Array.from(
      chatContentRef.value.querySelectorAll('.send-message-image img')
    );
    imageList.value = list.map((image) => {
      const parentElement = image.parentElement;
      return {
        src: image.src,
        index: Number(parentElement?.dataset.index)
      };
    });
  }
}
/**@name 当图片被点击时 */
function handleImageClick(index: number) {
  makeImageList();
  reviewrVisible.value = true;
  // 图片维护的数组与消息数组的索引不一致索引要对齐搜索
  const findIndex = imageList.value.findIndex((i) => i.index === index);
  nextTick(() => {
    reviewrRef.value?.setActiveItem(findIndex);
  });
}
watch(
  () => props.list,
  (n, o) => {
    nextTick(() => {
      if (chatContentRef.value) {
        if (props.list.length && (props.list[props.list.length - 1].isMy || o!.length <= 2)) {
          // o.length<=2 用于判断是否是第一次加载
          chatContentRef.value.scrollTo(0, chatContentRef.value.scrollHeight);
        }
      }
    });
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss">
.chat-content {
  height: calc(100% - 240px);
  border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
  background-color: #f5f5f5;
  overflow: auto;
  position: relative;
  text-align: center;
  .avatar {
    width: 60px;
  }
  .chat-item {
    margin: 10px 0;
  }
  .send-message-image img {
    width: 100%;
  }
  .message-create-time {
    font-size: 10px;
    padding: 2px 0;
    color: #606266;
    display: inline-block;
    padding: 5px;
    margin: 0 auto;
  }

  .other {
    display: flex;
    align-items: flex-start;
    margin: 20px 0 20px 5px;

    .chat-bubble {
      word-break: break-all;
      max-width: calc(100% - 80px);
      position: relative;
      border-radius: 4px;
    }

    .chat-bubble-style {
      background-color: #fff;
      border: solid 1px #fff;
      box-shadow: 0px 2px 7px 0px rgba(123, 123, 123, 0.17);
      padding: 10px;
      text-indent: -6px;

      &::before,
      ::after {
        content: '';
        position: absolute;
        top: 14px;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }

      &::before {
        left: -10px;
        border-right: 10px solid #fff;
      }

      &::after {
        left: -8px;
        border-right: 10px solid transparent;
      }
    }
  }

  .self {
    display: flex;
    align-items: flex-start;
    margin: 20px 5px 20px 0px;
    flex-direction: row-reverse;

    .chat-bubble {
      word-break: break-all;
      max-width: calc(100% - 80px);
      position: relative;
      border-radius: 4px;
    }

    .chat-bubble-style {
      padding: 10px;
      text-indent: -6px;
      background-color: #95ec69;
      border: solid 1px #95ec69;
      box-shadow: 0px 2px 7px 0px rgba(123, 123, 123, 0.17);

      &::before,
      ::after {
        content: '';
        position: absolute;
        top: 14px;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }

      &::before {
        right: -10px;
        border-left: 10px solid #95ec69;
      }

      &::after {
        left: -8px;
        border-left: 10px solid transparent;
      }
    }
  }
}
</style>
