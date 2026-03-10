import { createRouter, createWebHistory } from 'vue-router'
import Root from './components/Root.vue'
import { useAuthStore } from './stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: Root,
      children: [
        { path: '', name: 'home', component: () => import('./pages/Home.vue') },
        { path: 'menu', name: 'menu', component: () => import('./pages/Menu.vue') },
        { path: 'cart', name: 'cart', component: () => import('./pages/Cart.vue') },
        { path: 'login', name: 'login', component: () => import('./pages/Login.vue') },
        { path: 'mobile-app', name: 'mobile-app', component: () => import('./pages/MobileApp.vue') },
        { path: 'contact', name: 'contact', component: () => import('./pages/Contact.vue') },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('./pages/Profile.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'my-orders',
          name: 'my-orders',
          component: () => import('./pages/MyOrders.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('./pages/AdminDashboard.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
      ],
    },
  ],
})

let sessionRestored = false

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!sessionRestored) {
    sessionRestored = true
    await auth.restoreSession()
  }

  if (to.meta.requiresAuth && !auth.currentUser) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && auth.currentUser?.role !== 'admin') {
    return { name: 'home' }
  }
})
