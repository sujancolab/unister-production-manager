<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Final Inspection Detail</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list v-if="inspection">
        <ion-item>
          <ion-label>Mark No</ion-label>
          <ion-text>{{ inspection.mark_no }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Status</ion-label>
          <ion-text>{{ inspection.status }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Remarks</ion-label>
          <ion-text>{{ inspection.remarks }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Created At</ion-label>
          <ion-text>{{ formatDate(inspection.created_at) }}</ion-text>
        </ion-item>
      </ion-list>
      <ion-button expand="block" color="medium" @click="goBack">Back</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonText, IonButton } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { getFinalInspection } from '@/services/finalInspectionService';

const route = useRoute();
const router = useRouter();
const inspection = ref<any>(null);

const fetchInspection = async () => {
  inspection.value = await getFinalInspection(Number(route.params.id));
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const goBack = () => {
  router.back();
};

onMounted(fetchInspection);
</script>
