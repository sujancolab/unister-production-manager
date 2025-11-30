<template>
  <ion-menu 
    content-id="main-content" 
    type="overlay"
    :class="{ 'menu-collapsed': store.sidebarCollapsed }"
  >
    <ion-header>
      <ion-toolbar color="light">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-list>
        <ion-item 
          button 
          @click="navigateToProduction"
          class="menu-item"
          detail
        >
          <ion-icon 
            :icon="businessIcon" 
            slot="start"
          ></ion-icon>
          <ion-label>
            Production Process
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, menuController } from '@ionic/vue';
import { business } from 'ionicons/icons';
import { useAppStore } from '../store';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();

const businessIcon = business;

const navigateToProduction = async () => {
  router.push('/production');
  await menuController.close();
};
</script>

<style scoped>
ion-menu {
  --width: 256px;
}

.menu-collapsed {
  --width: 70px;
}

.menu-item {
  --background: #eef2ff;
  --color: #4338ca;
  margin: 8px 16px;
  border-radius: 8px;
}

.menu-item ion-icon {
  color: #4338ca;
  font-size: 24px;
}

.menu-item ion-label {
  font-weight: 600;
  margin-left: 8px;
}
</style>