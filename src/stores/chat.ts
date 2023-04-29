import type {
  ChatMessageRoomContent,
  ChatMessageSendContent,
  ChatNotificationListItemType,
  ChatToolsType,
  ContactInfo,
  FriendInfo,
  GourpInfo,
  ObjectId
} from '@/types';
import { ElMessage } from 'element-plus';
import { defineStore } from 'pinia';

// 好友信息缓存
const friendsInfoCache: Map<ObjectId, FriendInfo> = new Map();
// 群组人员信息缓存
const groupInfoCache: Map<ObjectId, GourpInfo> = new Map();
export const useChatStore = defineStore({
  id: 'chat',
  state: () => {
    return {
      currentType: 'chat' as ChatToolsType,
      globalSearch: '',
      // 当前聊天房间
      currentRoom: undefined as undefined | ChatMessageRoomContent,
      // 当前联系人
      currentContact: undefined as undefined | ContactInfo
    };
  },
  actions: {
    /**@name 获取好友信息 */
    async getFriendsInfo(id: ObjectId) {
      if (friendsInfoCache.has(id)) {
        return friendsInfoCache.get(id);
      } else {
        return getUser(id).then((res) => {
          friendsInfoCache.set(id, res);
          return res;
        });
      }
    },
    // 获取消息记录
    async getMessageRecord(room?: ChatMessageRoomContent) {
      if (room) {
        if (room?.type === 'personal') {
          // 如果是私聊
          return getPersonalMessageRecord(room.id);
        }
      }
    },
    /**@name 设置当前工具栏显示内容 */
    setCurrentType(type: ChatToolsType) {
      this.currentType = type;
    },
    /**@name 切换消息房间 */
    switchMessageRoom(room?: ChatMessageRoomContent) {
      this.currentRoom = room;
      this.currentType = 'chat';
    },
    switchContact(contact?: ContactInfo) {
      this.currentContact = contact;
      this.currentType = 'contact';
    },
    /**@name 全局搜索 */
    handleGlobalSearch() {
      const temp = this.globalSearch;
      this.globalSearch = '';
      ElMessage(temp);
    }
  }
});

async function getUser(id: ObjectId): Promise<FriendInfo> {
  if (id === '1') {
    return {
      name: '小金',
      username: '001',
      associatedAt: '2023-04-24 12:40:10',
      associatedStatus: 'friend',
      id: '1',
      avatar:
        'data:image/jpeg;base64,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'
    };
  } else if (id === '2') {
    return {
      name: '小帅',
      username: '002',
      associatedAt: '2023-04-24 12:40:10',
      id: '2',
      associatedStatus: 'friend',

      avatar:
        'data:image/jpeg;base64,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'
    };
  } else {
    return {
      name: 'BOT',
      username: '003',
      associatedStatus: 'friend',

      associatedAt: '2023-04-24 12:40:10',
      id: '3',
      avatar:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8ip8wplLLz+vw7nrrv+fszr9IVpctfutY0nLg/oLoYj68kocSU0OONxNUrrtCg2OjM4+snlrODyd8Eocnb8Pa83ee65O/M6fLi8/ie0eAkq9Dy+fvK6fJVq8XX7/V0xd212eSZ2e1Outldr8h+wdSw3+5GttVqs8h8y+Pm+Pyr4fFdv957yuOZzt6DwtX6khxQAAANKklEQVR4nO2de3uisBLGlYgRWW8oIiAXtyq029rv/+0OiBcEhGQyAT3nvH/t027Vn5PMTIZk0uvJFVHtwDr+/QxHH9HQ7ff7fxTD0AZjfx9Pnd0isFUi+RPI1Jf3bxJ+p2Bun1LaP+uPkpMxGO8Pp93iq+uPyi1ie/OfaEbpDeymB8JUuq4bmn9wFvbbWFP1/v5EidX6lSoRXjiVlHLz+pDEPoZDt2S4ZsLMmsrgsHtpUwbzcFhH10CY2XIQO2bXIJUi5vy71nhshGdpe8d8NUuq1k+j9dgJE40Pa7VrqLuI+ffDZcJjJ0zkn15kShLvk9F8nISJIX9fwLmqVrNzARMmMzL2tp3yEeubeXiCCBXd2K+7syPxuPm4CRMZ+67GKoQPQpgwxpsO+MzEv3DjUepGY0PnZxwc7Jb5viYAvj4dzpNVhO1o/Ii6dmp1AWJ9A/iSXNzK/nxn8CMqyn7dGl8QPls4NBBOrq9wAgzURIeWEtZjBMFLx2hwfQkTRqj4uxb4gpArwOcV3TJNApiJmWLpZrQiKF9CePMVBDQRMzPKnY3qJ9iAqbzr6yyAozSVcZC46AhALvQm+nl9oYMAYTJSg7oPKSByhOQwD4jzc/pFpiJ8qRl3ctK4pSvGlyKGlm2vYyELnhGnEvjMUNCAGSL9Y+jCgEmKg+9Tgw8MwD4s866Sj4woEiTkEOq4YeMoPgUvcv8Y8Fj4KA0xwZkPkfjo0jRt+xdhIp4RHTRANAtmufcUiVAxHJSoQSZogNiESdRAQCQTLB8jgVDRxRHJBI9PAqGiiCKiWlAKoagV8ZyMLMLE3bwQoBRCIUQLKw5KJRQI/RayBWURKhowgQuAFaf2CYFpuIm1mmiBUAchoqwHWyJUlJibjywlAEok5A+LeOuldggVg9OhBlIAZRIqBlcFTv2WAiiVUIl56qifMiahbELlwA5oyeGTTWgwB/4ArezULiF74JcRCVshZI2KR2mA0gkVppBhShujLRAyjdNQGl8LhCz+1JJnwTYIlUZ/+iX2iLB7wn1T3EctrXVBaJzqAW3IRqCXIlS0+t1TstK1Fgn1WmezwS49dUCoDGq2+ZGRXBO2Q6jEzxfDnly+tgiNp0aUbsJ+fzR3nJ34ToUG7Z8ZEb8+WhKlfzA2KjToWf10K9+Efbzn+LWKq7e/e/JN2BahsaichfKWhZnOZ/XSUapLH6h6pTuVGQtpn67oLBotJ4mncaa/sa/JxdQq3KmcEnDGR92P5TF4SInVYHfwsfadVOi3bERTUkaaDMzRZFOZ8G8Xji/LkoNydor7OPsOOFzWnQchi8NADmNpiaFKeNKU2G82aSwr2FNNBqNfHDYyoj11l0znQOyphAlZLJ4S/GVTMv+8aqKyFhISucPj5LDRQwV15xzPEbYndDOOH8fPHNuENGI24MWMY2wzPm7RwE5J6Yj7JJaJPFL1hwI49uNCugRsVCIHVEJFy7tx5EEKAkwmI/LSOFfiR0667ye4ePWLSphLv3FriDQE76Xbih01KSiXuaE+bVqVAMmzHjRqOZ6gupv7MMUcpHRW+NjqMRyNQqsMef75vPBze4wHeK+cErZwT/tu2kmn4X8NCyszy12lC99VVNgqsYmyn8+sx5+beITK4PplM8WKJIm2PM9aNpx9Ws0LgLPL/6fRQw5+m/rULaQGmA71+m2zxAoaXg4PmqPa/zYqDLoZrfwVGa1uP48ekwOCOBUvaQ1TrHBvpyPrysYlg8xXuV/mxu/DixTMvkADvGbfNssuy+HdLDXjtBQJ89lg/pf59TYdFbwN1omTZJGYDY8N0zS8OYSaJ4zULWSjav7Lo+H9F/lhQ6MCoTnAItSyqiJTykbdSdothph1BauSCR8qB8yEvRMW4WUiskVDSmejMKzvtDMsLSjyr716NkrD4l/Z4KPeBV0iIuPuktVys9l4dV8HXRY/6kO2RHPhYpP7puix9GdoM9FPX+2LceWURbraqmq5DKvev74HU+X8Nx2Vc7cF2gm+NARsGFO2M2Fd3Zh+lD5pWknP/oCuHtfEN3RaTIJSbWMkwnPMZ027mwnn5Y+aJEwjmqZnblhoTWIv02Lxio4qN746SIB6mnyzloKbCKlbvUlXtZajsKIsTLzJaLSsyMjP3wvSMNVPHKvfRsKK+QQW8ZEIk6xGZd0E1UhY9qQCwvKme5UtZ2MitBo/Nod2SIRJ3haw1oIbPQ1qtwoTaSIOAvZn202EEWrLERVprW8sekdGwCbCymgIF9njDFNj15tjEYa4hFhVN4d9u2UD4QrVlfZ6oh1erpqy19maCCszGriwVlCHXm3ZpYGQrnJCJnT0vOCEcY/56XaZMDpaOSG3/bPXecFX/X6P+ShsibBUX5EoeOzwe8wPfysI2+v0Cycc9Gb/5YRajxXwXQmN/xO+PaHyf8L/RcK73oKQdx72lu7wKheZ8Mu7lIztyz9U77aoHmtFsRPyxcMeUXNCBTzOVnSSZknH/ur8AMQbrq7bVoipFrRmrQFonDmNPKnnZ6ne5ekw3fRIWjO+VPxJKellroqPOfNSeQrSZ6lpUdmj2ZvZ5zddihL6nGsLeVLTZzVpvc5MjUm9nprYkorb0GdfH9KJbT4Kd710TIiyeehSN5uHtL/M5jpZFN+WmTDm2EszLCrEdTWB5WV+ZXPMngEER++6PvMHd/lchAeeHey0oG7ioT7mIpyy19rKwB1FfD5Ch71e+qaEO4HzXG9BaCzYn1u8J+E4YH/29KaENvvzw/ck3KsCO6DfgTB9Bgw/0vUWhOkBL/AW6LcgTPdisO6neUvC834a1j1Rb0monT8itGvSOxCes3TwTv13IMz2JkKPBL0DYba/lGmP8HsSXvYIQ/O2NyC87POGZjWvT6hfT8oCJ+LrE96OkQInYmeEpm3bbJfTXTfnMp57ehVCJS1HMVX1B7eNBrCJ2BWhP93tdr8MB6NzXb9gyXdHhE72rjbD8aj7+UPYGdJOCPVbvwu1cbd77gwpLF50Y8N796DGY3z5NjygeNGNDX+vPzIbt4Ln27WCzuN3NA+n2dhbNAI+nMcH9VToypdq8XT629yf6LGnAmiYdhYPGTcrPvbFgPQ2efGdCoXeJuSH34gvTljshQXoMfTahKUG7YA+Ua9NWOoTBfE1UWu3gW/5z5eU2wlD+rVxthGCa8290Xtc/vYBPfeK7QWkacvfhOC34mUAfRNXy1ZmIuB0SWUvYVD6PfJUIllbwO261b0vQc+7KZ2VNqHUazYe8Alyu65R7SFa6UFLu+xB21u30IS2FcKn97AJG3E4Y1Bpp2i1RAif9oIW7CRMh4ieVaSFy/N+3qINvSliBnASOcxVc1pJrJcwvE9bWQJHSAeVjaCvEmryiZiKC3Q3qb8bQbA3XbGHElwCXSMa7rcQu6MErekAgXf+aLqjpGcLORssbwrv3qLvv5peXOiuoIpmOiAJ9IxguHtNpMUgkq8x4X6G5f48oTu7cIwIb7vHdrecSCdMOmx+/UYt4CZkvKpTaJwinMqAtxVkvVE2EOnPPhRucbIGW5D9VmCROyyFizcCHUw5Lq/+FEEUdDbwMcpxD6nYXbJDoWZDDnwSckWqgPlYYoURo8a04rngflTjdAAidzqv+BuyXwVvnsR7p3ND+8AmK0I7Zpg+dIzqU/53E4mKqxFooJrwuzz471ZP3k4kKoIS1ABuQR80LwLwaZrUilHNHX3VWhuS09GyhG5mobxB4wTPRp/WR5sRxW4uYbtlJpPI7RZwwF5vLlZAZb5ohuwE7kQynOY3kIbYD1nCMFnswXiigMIXXdHhstEJLA5wF5MGQtFuVaIXBFM3rLu0a7uORfgUQxiwR0SvK0s76c6rIdXFVPDiNXELppoIP3SjtB+Fx0Alt49DtvbCiQeKYHNE44TSUI2IuZsbJR1+hMvJyXFO0ynOBYiGg9Uxbo50o9f5DkvlvPVOFC6VJuhF87IElosF4T0D1rjXS7WIIkVUKYS6L5DJVElopSGDEJps1yCGjZfotEioH9ABe2kTrJchNAAregaRY8M9QW0R6rg+Jq8A3H8BlTBG7Rz+KPVTeDKKEx7kbhe0RH2qKCF2kCgrEPSpQoS6EsvwoUUdRSpUYoS+NBfzKPOnDzcjnFA3pATBalnwJzdwwr30GZjX1wS6tQhIqA9O7Z19yGR/whhhhINDaycfcvJCSI4DINSNmLuAjiPiffMz8hNq+7pSlmxGi5uRkzCx37o7vjOjF/LNRz7CQex1y5cxLoccaQ4P4fi3w/GZFzH/fjCvHZkJDd/pwn8+k2p9RmyGZCLUE/Ot245/TSLm/JtltLIQarFjv8bwLCr4FzZCNhDqiXPZtZd+8ovYx3Do1lHWEOpp7rJ7UevlpW7+/iSe5wnlE0Jd0fyD8yKuk0HE3vz7iYbnMn4TYVriT+kWb2C8or68f5Of72jo9nM3lj8QGoNxfDjtNq/mNnlEVDvwjn8/w9FHipoQGoahDcZ+fJg6u0Vgb2Vb7j+XtWcJ3Jf6DAAAAABJRU5ErkJggg=='
    };
  }
}
// 获取私聊消息记录
async function getPersonalMessageRecord(
  friendId: ObjectId,
  pageSize: number = 0
): Promise<ChatMessageSendContent[]> {
  if (friendId === '1') {
    return [
      {
        isMy: true,
        senderId: '0',
        message: `你好小金`,
        sendMessageType: 'text',
        sendAt: '2023-04-24 13:12'
      },
      {
        isMy: false,
        senderId: '1',
        message: `你好开发者`,
        sendMessageType: 'text',
        sendAt: '2023-04-24 13:12'
      },
      {
        isMy: false,
        senderId: '1',
        message: `这只是一个模拟消息`,
        sendMessageType: 'text',
        sendAt: '2023-04-24 14:12'
      },
      {
        isMy: false,
        senderId: '1',
        message: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbr4k31GGsP37V7XNWbTU8SKCI3TDtQY6YQg&usqp=CAU`,
        sendMessageType: 'image',
        sendAt: '2023-04-24 14:12'
      },
      {
        isMy: false,
        senderId: '1',
        message: `https://cdn.coverr.co/videos/coverr-women-holding-hands-outdoors-3878/1080p.mp4`,
        sendMessageType: 'video',
        filename: 'outdoors-3878',
        filetype: 'video/mp4',
        sendAt: '2023-04-24 14:12'
      }
    ];
  }
  return [];
}
