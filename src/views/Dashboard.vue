<template>
  <ion-page>
    <Header />
    <Sidebar />
    
    <ion-content id="main-content" class="ion-padding" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="dashboard-container">
        <h1>Dashboard</h1>
        <ion-card>
          <ion-card-content>
            <p class="welcome-text">
              Welcome back, <span class="username-highlight">{{ store.loggedInUser.name }}</span>!
            </p>
            <p class="instruction-text">
              Click the menu icon (☰) at the top left to open the sidebar and select "Production Process" to get started.
            </p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonCard, IonCardContent, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { useAppStore } from '../store';

const store = useAppStore();
</script>

<style scoped>
ion-content {
  --padding-top: 20px;
}

.dashboard-container {
  max-width: 896px;
  margin: 0 auto;
  padding-top: 16px;
}

h1 {
  font-size: 30px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
  margin-top: 0;
}

ion-card {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.welcome-text {
  font-size: 18px;
  color: #4b5563;
  margin: 0 0 16px;
}

.username-highlight {
  font-weight: 600;
  color: #4f46e5;
}

.instruction-text {
  color: #6b7280;
  margin: 0;
}
</style>