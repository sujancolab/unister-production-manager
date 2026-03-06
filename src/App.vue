<template>
  <ion-app>
    <Sidebar v-if="showMenu" />
    <ion-router-outlet id="main-content" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const showMenu = computed(() => Boolean(route.meta?.requiresAuth));
</script>

<style>
/* Global Styles */
:root {
  --ion-color-primary: #4f46e5;
  --ion-color-primary-rgb: 79, 70, 229;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #4338ca;
  --ion-color-primary-tint: #6366f1;
}

ion-content {
  --background: #f9fafb;
}

ion-menu {
  --width: 280px;
}
</style>
