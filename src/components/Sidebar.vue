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
        <ion-item 
          button 
          @click="navigateToFinalInspection"
          class="menu-item"
          detail
        >
          <ion-icon 
            :icon="clipboardIcon" 
            slot="start"
          ></ion-icon>
          <ion-label>
            Final Inspection
          </ion-label>
        </ion-item>
        <ion-item 
          button 
          @click="navigateToPackingList"
          class="menu-item"
          detail
        >
          <ion-icon :icon="cubeIcon" slot="start"></ion-icon>
          <ion-label>
            Packing List
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, menuController } from '@ionic/vue';
import { business, clipboard, cube } from 'ionicons/icons';
import { useAppStore } from '../store';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();

const businessIcon = business;
const clipboardIcon = clipboard;
const cubeIcon = cube;

const navigateToProduction = async () => {
  router.push('/production');
  await menuController.close();
};

const navigateToFinalInspection = async () => {
  router.push('/final-inspections');
  await menuController.close();
};

const navigateToPackingList = async () => {
  router.push('/packing-list');
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