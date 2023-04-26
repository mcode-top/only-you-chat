import type { ChatMessageSendType } from '@/types/chat';
import moment from 'moment';

/**@name 解析发送消息的类型转换为中文 */
export function parseSendmessageType(type: ChatMessageSendType, message?: string) {
  if (type == 'text') {
    return message;
  } else if (type == 'image') {
    return '[图片]';
  } else if (type == 'video') {
    return '[视频]';
  } else if (type == 'file') {
    return '[文件]';
  } else if (type == 'audio') {
    return '[音频]';
  }
}

/**@name 解析最后一次更新时间将其转换为文本 */
export function pareseLastMessageDate(date: string | Date) {
  const momentDate = moment(date);
  const distanceNow = Math.floor((Date.now() - Number(moment(date))) / 1000);
  if (distanceNow < 86400) {
    return momentDate.format('HH:mm');
  } else if (distanceNow < 172800) {
    return '咋天';
  } else {
    return momentDate.format('YY/MM/DD');
  }
}
