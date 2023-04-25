import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/all',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/:id(\\d+)',
        name: 'article',
        component: () => import('pages/ArticlePage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'sign-in',
        name: 'sign in',
        component: () => import('pages/SigninPage.vue'),
      },
      {
        path: 'sign-up',
        name: 'register',
        component: () => import('pages/SignupPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
