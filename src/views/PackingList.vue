<template>
    <ion-page>
        <Header />
        <Sidebar />

        <ion-content id="main-content" class="ion-padding" :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Packing List</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="production-container">
                <div class="page-header">
                    <ion-button fill="clear" color="medium" @click="goToDashboard" class="back-button">
                        <ion-icon slot="start" :icon="arrowBack"></ion-icon>
                        Back to Dashboard
                    </ion-button>
                    <h1>Packing List</h1>
                </div>

                <ion-card>
                    <ion-card-header>
                        <ion-card-title>Shipment Details</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-grid>
                            <ion-row>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Client</ion-label>
                                        <ion-select v-model="form.client_id" placeholder="Select Client">
                                            <ion-select-option v-for="client in clients" :key="client.id" :value="client.id">
                                                {{ client.name }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Project</ion-label>
                                        <ion-select v-model="form.project_id" placeholder="Select Project" :disabled="!projects.length">
                                            <ion-select-option v-for="project in projects" :key="project.id" :value="project.id">
                                                {{ project.project_id }} - {{ project.description }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Transporter</ion-label>
                                        <ion-select v-model="form.transporter_id" placeholder="Select Transporter">
                                            <ion-select-option v-for="transporter in transporters" :key="transporter.id" :value="transporter.id">
                                                {{ transporter.name }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Vehicle Number</ion-label>
                                        <ion-input v-model="form.vehicle_number" placeholder="Enter Vehicle No"></ion-input>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Truck Tare Weight (kg)</ion-label>
                                        <ion-input type="number" v-model="form.truck_tare_weight" placeholder="0.00"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-card-content>
                </ion-card>

                <ion-card>
                    <ion-card-header>
                        <ion-card-title>Items</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <div class="add-item-section">
                            <ion-grid>
                                <ion-row class="ion-align-items-end">
                                    <ion-col size="12" size-md="5">
                                        <ion-item>
                                            <ion-label position="stacked">Mark No</ion-label>
                                            <ion-input v-model="currentItem.mark_no" placeholder="Scan or Enter Mark No"></ion-input>
                                            <ion-button slot="end" fill="clear" @click="scanQR">
                                                <ion-icon slot="icon-only" :icon="qrCodeOutline"></ion-icon>
                                            </ion-button>
                                        </ion-item>
                                    </ion-col>
                                    <ion-col size="6" size-md="3">
                                        <ion-item>
                                            <ion-label position="stacked">Quantity</ion-label>
                                            <ion-input type="number" v-model="currentItem.quantity" min="1"></ion-input>
                                        </ion-item>
                                    </ion-col>
                                    <ion-col size="6" size-md="4">
                                        <ion-button expand="block" @click="addItem" :disabled="!currentItem.mark_no">
                                            Add Item
                                        </ion-button>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </div>

                        <ion-list v-if="form.items.length > 0">
                            <ion-item v-for="(item, index) in form.items" :key="index">
                                <ion-label>
                                    <h2>{{ item.mark_no }}</h2>
                                    <p>Qty: {{ item.quantity }}</p>
                                </ion-label>
                                <ion-button slot="end" fill="clear" color="danger" @click="removeItem(index)">
                                    <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                                </ion-button>
                            </ion-item>
                        </ion-list>
                        <div v-else class="ion-text-center ion-padding">
                            <p class="text-medium">No items added yet.</p>
                        </div>
                    </ion-card-content>
                </ion-card>

                <ion-card>
                    <ion-card-header>
                        <ion-card-title>Weight Details</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-grid>
                            <ion-row>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Gross Combination Weight (kg)</ion-label>
                                        <ion-input type="number" v-model="form.gross_combination_weight" placeholder="0.00"></ion-input>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Actual Weight (kg)</ion-label>
                                        <ion-input type="number" v-model="form.actual_weight" placeholder="0.00"></ion-input>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                        <ion-button expand="block" class="ion-margin-top" @click="submitForm" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : 'Save Packing List' }}
                        </ion-button>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>

        <ion-modal :is-open="isScannerOpen" @didDismiss="closeScanner">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Scan QR Code</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click="closeScanner">Close</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div id="qr-reader" style="width: 100%;"></div>
            </ion-content>
        </ion-modal>
    </ion-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonList,
    IonModal, IonButtons
} from '@ionic/vue';
import { arrowBack, qrCodeOutline, trashOutline } from 'ionicons/icons';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { getPackingListFormData, getPackingListProjects, storePackingList } from '@/services/packingListService';
import { Html5QrcodeScanner } from 'html5-qrcode';

const router = useRouter();
const clients = ref([]);
const transporters = ref([]);
const projects = ref([]);
const isSubmitting = ref(false);
const isScannerOpen = ref(false);
let html5QrcodeScanner = null;

const form = ref({
    client_id: '',
    project_id: '',
    transporter_id: '',
    vehicle_number: '',
    truck_tare_weight: '',
    gross_combination_weight: '',
    actual_weight: '',
    items: []
});

const currentItem = ref({
    mark_no: '',
    quantity: 1
});

const loadFormData = async () => {
    try {
        const data = await getPackingListFormData();
        clients.value = data.clients;
        transporters.value = data.transporters;
    } catch (error) {
        console.error('Error loading form data:', error);
    }
};

watch(() => form.value.client_id, async (newClientId) => {
    form.value.project_id = '';
    projects.value = [];
    if (newClientId) {
        try {
            const data = await getPackingListProjects(newClientId);
            projects.value = data.projects;
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
});

const onScanSuccess = (decodedText, decodedResult) => {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
    currentItem.value.mark_no = decodedText;
    closeScanner();
};

const onScanFailure = (error) => {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
};


const scanQR = () => {
    isScannerOpen.value = true;
    setTimeout(() => {
        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: {width: 250, height: 250} },
                /* verbose= */ false);
        }
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }, 200); // Wait for modal to open
};

const closeScanner = () => {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner.", error);
        });
        html5QrcodeScanner = null;
    }
    isScannerOpen.value = false;
};

const addItem = () => {
    if (currentItem.value.mark_no) {
        form.value.items.push({ ...currentItem.value });
        currentItem.value.mark_no = '';
        currentItem.value.quantity = 1;
    }
};

const removeItem = (index) => {
    form.value.items.splice(index, 1);
};

const submitForm = async () => {
    if (!form.value.client_id || !form.value.project_id || !form.value.transporter_id || form.value.items.length === 0) {
        alert('Please fill in all required fields and add at least one item.');
        return;
    }

    isSubmitting.value = true;
    try {
        await storePackingList(form.value);
        alert('Packing List saved successfully!');
        router.push('/dashboard');
    } catch (error) {
        console.error('Error saving packing list:', error);
        alert('Failed to save packing list.');
    } finally {
        isSubmitting.value = false;
    }
};

const goToDashboard = () => {
    router.push('/dashboard');
};

onMounted(() => {
    loadFormData();
});
</script>

<style scoped>
.production-container {
    max-width: 896px;
    margin: 0 auto;
    padding-top: 16px;
}
.page-header { margin-bottom: 24px; }
.back-button { margin-bottom: 12px; font-weight: 600; --padding-start: 0; }
.text-medium { color: #666; }
</style>