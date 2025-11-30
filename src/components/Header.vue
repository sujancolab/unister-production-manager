<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button auto-hide="false"></ion-menu-button>
      </ion-buttons>

      <ion-title>
        <div class="logo-container">
          <div class="logo-circle">P</div>
          <span class="company-name">Production Co.</span>
        </div>
      </ion-title>

      <ion-buttons slot="end">
        <div class="user-info">
          <ion-icon :icon="personIcon"></ion-icon>
          <span class="username">{{ store.loggedInUser.name }}</span>
        </div>
        <ion-button color="danger" @click="handleLogout">
          <ion-icon :icon="logOutIcon" slot="start"></ion-icon>
          <span class="logout-text">Logout</span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, IonMenuButton } from '@ionic/vue';
import { person, logOut } from 'ionicons/icons';
import { useAppStore } from '../store';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();

const personIcon = person;
const logOutIcon = logOut;

const handleLogout = () => {
  store.logout();
  router.push('/login');
};
</script>

<style scoped>
ion-toolbar {
  --padding-start: 8px;
  --padding-end: 8px;
}

ion-menu-button {
  --color: #1f2937;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
}

.logo-circle {
  width: 40px;
  height: 40px;
  background-color: #4f46e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 8px;
}

.user-info ion-icon {
  color: #4b5563;
}

.username {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.logout-text {
  margin-left: 4px;
}

@media (max-width: 768px) {
  .company-name {
    display: none;
  }
  
  .username {
    display: none;
  }

  .logout-text {
    display: none;
  }
}

@media (max-width: 576px) {
  .user-info {
    padding: 6px 8px;
  }
}
</style>