import type { ChatNotificationListItemType, DateType, ObjectId } from '.';

// 用户关系
export type PersonAssociated = 'friend' | 'stranger' | 'blacklist';
// 群组关系
export type GroupAssociated = 'friend' | 'stranger' | 'blacklist';

// 好友信息
export type UserInfo = {
  id: ObjectId;
  name: string;
  username: string;
  avatar: string;
};
// 好友信息
export type FriendInfo = UserInfo & {
  /**@name 关联时间 */
  associatedAt: DateType;
  associatedStatus: PersonAssociated;
  // 备注名
  remarkName?: string;
};

// 群组信息
export type GourpInfo = {
  id: ObjectId;
  name: string;
  avatar: string;
  description: string;
  members?: UserInfo[];
  membersCount: number;
  memberIds?: string[];
  /**@name 关联时间 */
  associatedAt: DateType;
  associatedStatus: GroupAssociated;
  // 备注名
  remarkName?: string;
};

// 联系人详情
export type ContactInfo = (GourpInfo | FriendInfo) & {
  type: ChatNotificationListItemType;
};
