import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { type IStaticMethods } from 'flyonui/flyonui'

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

const AuthLayout = () => import('@/layout/auth/auth-layout.vue')
const Auth = () => import('@v/auth/auth.vue')
const Login = () => import('@v/login/login.vue')

const HomeLayout = () => import('@/layout/home/home-layout.vue')
const Personal = () => import('@v/personal/personal.vue')
const PersonalApplication = () => import('@v/personal/application.vue')
const PersonalPlugin = () => import('@v/personal/plugin.vue')

const Application = () => import('@v/application/application.vue')
const Plugin = () => import('@v/plugin/plugin.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Auth
      },
      {
        path: 'login',
        component: Login
      }
    ]
  },
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        path: '',
        component: Personal
      },
      {
        path: 'personal/',
        component: Personal,
        children: [
          {
            path: '',
            component: PersonalApplication
          },
          {
            path: 'application',
            component: PersonalApplication
          },
          {
            path: 'plugin',
            component: PersonalPlugin
          }
        ]
      }
    ]
  },
  {
    path: '/app/dev/:id',
    component: Application
  },
  {
    path: '/plugin/dev/:key',
    component: Plugin
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((_, __, failure) => {
  if (!failure) {
    setTimeout(() => {
      window.HSStaticMethods.autoInit()
    }, 100)
  }
})

export default router
