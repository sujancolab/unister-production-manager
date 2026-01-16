<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Final Inspection</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Mark No</ion-label>
          <ion-input v-model="form.mark_no" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Status</ion-label>
          <ion-select v-model="form.status" :options="statusOptions"></ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Remarks</ion-label>
          <ion-textarea v-model="form.remarks"></ion-textarea>
        </ion-item>
        <ion-button expand="block" @click="submitForm" :disabled="loading">Create</ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonSelect, IonTextarea, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { createFinalInspection } from '@/services/finalInspectionService';

const router = useRouter();
const loading = ref(false);
const form = ref({ mark_no: '', status: '', remarks: '' });
const statusOptions = [
  { value: 'Completed', text: 'Completed' },
  { value: 'Rejected', text: 'Rejected' },
  { value: 'Pending', text: 'Pending' }
];

const submitForm = async () => {
  loading.value = true;
  try {
    await createFinalInspection(form.value);
    router.push({ name: 'FinalInspectionList' });
  } finally {
    loading.value = false;
  }
};
</script>
