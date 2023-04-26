import * as VueRouter from 'vue-router';
export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/login',
      name: '登录界面',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/register',
      name: '注册界面',
      component: () => import('@/views/login/register.vue')
    },
    {
      path: '/chat',
      name: '聊天界面',
      component: () => import('@/views/chat/index.vue')
    }
  ]
});
