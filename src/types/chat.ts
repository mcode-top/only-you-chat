/**@name 聊天通知列表子内容 */
export type ChatNotificationListItem = {
  avatar: string;
  id: number;
  lastMessage: string;
  updatedAt: string;
  name: string;
  type: ChatNotificationListItemType;
  sendType: ChatMessageSendType;
  /**@name 未读消息数量 */
  unreadCount: number;
};
/**@name 聊天消息类别 */
export type ChatNotificationListItemType = 'personal' | 'group' | 'AI';
/**@name 聊天发送消息的类型 */
export type ChatMessageSendType = 'text' | 'video' | 'file' | 'image' | 'audio';
/**@name 聊天发送消息的内容 */
export type ChatMessageSendContent = {
  isMy: boolean;
  id?: number;
  //消息内容,如果是文件则可能会是string或File类型文件的string可能存储的是id或者link则于storageMode有关
  message: string | File;
  sendMessageType: ChatMessageSendType;
  sendAt: string;
  // 文件类型
  filetype?: string;
  // 文件名称
  filename?: string;
  // 文件大小
  filesize?: number;
  // 发送的文件存储方式
  storageMode?: 'alioss' | 'onedrive' | 'googledrive' | 'server';
  // sendMessageType = 'video'时的封面
  videoCover?: string;
};
