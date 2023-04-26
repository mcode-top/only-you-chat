<template>
  <div class="content">
    <div class="chat-header">
      <div class="chat-title">{{ content.friendInfo?.name }}</div>
      <div class="chat-other">
        <el-icon :size="20" color="#000"><MoreFilled /></el-icon>
      </div>
    </div>
    <message-content :list="messageList" />
    <div class="send-message" id="message">
      <div class="send-message-header">
        <el-icon
          title="表情"
          class="send-message-header-icon"
          :size="headerIconSize"
          @click.stop="content.showEmoji = !content.showEmoji"
          ><Help
        /></el-icon>
        <message-upload @change="handleControlBtn" v-slot="slotProps">
          <el-icon
            title="上传文件"
            class="send-message-header-icon"
            :size="headerIconSize"
            @click="slotProps.bindClick"
            ><Folder
          /></el-icon>
        </message-upload>
        <el-icon title="发送语音" class="send-message-header-icon" :size="headerIconSize"
          ><Microphone
        /></el-icon>
        <el-icon title="语音通话" class="send-message-header-icon" :size="headerIconSize"
          ><Phone
        /></el-icon>
        <el-icon title="视频通话" class="send-message-header-icon" :size="headerIconSize"
          ><VideoCamera
        /></el-icon>
      </div>
      <div class="send-message-content">
        <textarea
          class="send-message-content-textarea default-scrollbar"
          v-model="content.editorHtml"
          ref="contentRef"
          @keyup="handleTextareaKeyUp"
        />
      </div>
      <div class="send-message-btn">
        <el-dropdown
          split-button
          type="success"
          trigger="click"
          style="height: 30px"
          @click="sendTextMessage"
          size="small"
        >
          <div style="width: 100%">发送(S)</div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div style="width: 100%">按Enter键发送消息</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="width: 100%">按Ctrl+Enter键发送消息</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- emoji表情栏 -->
      <emoji-select
        ref="avcref"
        v-model:visible="content.showEmoji"
        @change="handleAddEmoji"
      ></emoji-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import type { ChatMessageSendContent } from '@/types/chat';
import { useChatStore } from '@/stores/chat';
import type { ChatFriendInfo } from '@/stores/chat';
import MessageUpload from './MessageUpload.vue';
import { MoreFilled, Folder, Microphone, Phone, VideoCamera, Help } from '@element-plus/icons-vue';
import moment from 'moment';
import EmojiSelect from './EmojiSelect.vue';
import { ElMessage } from 'element-plus';
import MessageContent from './MessageContent.vue';
const headerIconSize = 18;
const chatStore = useChatStore();
const contentRef = ref<HTMLTextAreaElement | null>(null);
const content = reactive({
  editorHtml: '',
  showEmoji: false,
  friendInfo: undefined as undefined | ChatFriendInfo,
  focus: false
});
const avcref = ref();
onMounted(() => {
  console.log('====================================');
  console.log(avcref);
  console.log('====================================');
});
watch(
  () => chatStore.$state.room,
  (room) => {
    if (room) {
      if (room.type === 'personal') {
        chatStore.getFriendsInfo(room.id!).then((res) => {
          content.friendInfo = res;
        });
      }
    }
  },
  { immediate: true }
);
const messageList = reactive<ChatMessageSendContent[]>([
  {
    isMy: true,
    id: 0,
    message: `在这个例子中，我们使用了ID选择器#my-element来选择ID为my-element的元素，并使用伪类选择器::-webkit-scrollbar来为它的滚动条设置样式。然后，我们定义了滚动条的宽度、背景颜色和滑块的颜色和形状。最后，我们使用伪类选择器::-webkit-scrollbar-thumb:hover来定义鼠标悬停在滑块上时的样式。`,
    sendMessageType: 'text',
    sendAt: '2023-04-24 13:12'
  },
  {
    isMy: false,
    id: 1,
    message: `在这个例子中，我们使用了ID选择器#my-element来选择ID为my-element的元素，并使用伪类选择器::-webkit-scrollbar来为它的滚动条设置样式。然后，我们定义了滚动条的宽度、背景颜色和滑块的颜色和形状。最后，我们使用伪类选择器::-webkit-scrollbar-thumb:hover来定义鼠标悬停在滑块上时的样式。`,
    sendMessageType: 'text',
    sendAt: '2023-04-24 13:12'
  }
]);

/**@name 输入框键盘按下 */
function handleTextareaKeyUp(e: KeyboardEvent) {
  e.stopPropagation();
  content.showEmoji = false; // 如果正在输入内容则关闭表情框
  if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.code == 'Enter') {
    sendTextMessage();
  }
}
/**@name 发送消息 */
function sendTextMessage() {
  if (content.editorHtml.trim() === '') {
    ElMessage({ message: '无法发送空数据', type: 'warning', duration: 2000 });
    return;
  }
  messageList.push({
    isMy: true,
    message: content.editorHtml,
    sendMessageType: 'text',
    sendAt: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  content.editorHtml = '';
}
/**@name 发送其他消息 */
function sendOtherMessage(message: ChatMessageSendContent) {
  if (message) {
    messageList.push(message);
  }
}
/**@name 绑定按钮事件 */
function handleControlBtn(message: ChatMessageSendContent) {
  sendOtherMessage(message);
}
/**@name 添加表情 */
function handleAddEmoji(emoji: string) {
  content.editorHtml += emoji;
  contentRef.value?.focus();
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  .chat-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 25px;
    height: 60px;
    line-height: 40px;
    .chat-title {
      font-size: 20px;
    }
    .chat-other {
      cursor: pointer;
    }
  }

  .send-message {
    height: 180px;
    position: relative;

    .send-message-header {
      display: flex;
      align-items: center;
      height: 30px;

      &-icon {
        &:hover {
          cursor: pointer;
          color: #73d13d;
        }
        transition: all 0.5s;
        margin: 0 5px;
      }
    }

    .send-message-content {
      height: calc(180px - 60px);
      overflow: auto;

      .send-message-content-textarea {
        padding: 10px 20px;
        width: 100%;
        height: 120px;
        border: none;
        background: transparent;
        display: block;
        resize: vertical;
        color: #606266;
        outline: none;
        resize: none;
      }
    }

    .send-message-btn {
      height: 30px;
      text-align: right;
      margin-right: 15px;
      opacity: 1;
    }
  }
}
</style>
