<!-- 图片选择框 -->
<template>
  <slot :bindClick="handleOpen"></slot>

  <Teleport to="#app">
    <input type="file" ref="fileRef" style="display: none" />
  </Teleport>
</template>

<script setup lang="ts">
import type { ChatMessageSendContent, ChatMessageSendType } from '@/types';
import moment from 'moment';
import { freeMedia, getVideoFristFarmeImage } from '@/utils';
import { defineEmits, ref, defineExpose } from 'vue';
// const emit = defineEmits(['change', 'update:visible']);

const emit = defineEmits<{
  (event: 'change', message: ChatMessageSendContent): void;
}>();
const fileRef = ref<HTMLInputElement | null>(null);
/**@name 打开文件 */
function handleOpen(): Promise<ChatMessageSendContent | undefined> {
  return new Promise((resolve, reject) => {
    if (fileRef.value) {
      fileRef.value.onchange = async () => {
        if (fileRef.value?.files?.length) {
          const currentFile = fileRef.value?.files[0];

          let message = {
            isMy: true,
            message: currentFile,
            sendMessageType: parseAccept(currentFile.type),
            sendAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            filesize: currentFile.size,
            filetype: currentFile.type,
            filename: currentFile.name
          } as ChatMessageSendContent;
          switch (message.sendMessageType) {
            case 'video':
              message = await addVideoMessageContent(message);
              break;

            default:
              break;
          }
          // 每次上传完成都重置下value,用于解决文件不能重复上传的问题
          fileRef.value!.value = '';
          emit('change', message);
          resolve(message);
        } else {
          resolve(undefined);
        }
      };
      fileRef.value.onerror = (err) => {
        reject(err);
      };
      fileRef.value.click();
    }
  });
}
/**@name 追加视频消息内容 */
async function addVideoMessageContent(defaultContent: ChatMessageSendContent) {
  try {
    if (defaultContent.message instanceof Blob) {
      const videoURL = URL.createObjectURL(defaultContent.message.slice(0, 77725));
      // 可能会出现白屏原因是浏览器不支持该视频格式 如H265 #https://www.cnblogs.com/cirry/p/14866813.html #https://blog.csdn.net/cgs1999/article/details/108847894
      const videoCover = await getVideoFristFarmeImage(videoURL, defaultContent.filetype!);
      //   freeMedia(videoURL);
      return {
        ...defaultContent,
        videoCover
      };
    }
  } catch (error) {
    console.error('获取视频封面失败', error);
  }
  return defaultContent;
}
/**@name 解析上传文件的类型 */
function parseAccept(type: string): ChatMessageSendType {
  if (/image\/.*/.test(type)) {
    return 'image';
  } else if (/video\/.*/.test(type)) {
    return 'video';
  } else if (/audio\/.*/.test(type)) {
    return 'audio';
  } else {
    return 'file';
  }
}
defineExpose({
  open: handleOpen
});
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
