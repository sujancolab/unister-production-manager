import { createRouter, createWebHistory } from '@ionic/vue-router';
import { useAppStore } from '../store';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('../views/ProductionProcess.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && store.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;