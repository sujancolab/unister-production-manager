<template>
    <ion-page>
        <Header />
        <Sidebar />

        <ion-content id="main-content" class="ion-padding" :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Production Process</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="production-container">
                <h1>Production Process</h1>

                <!-- Selection Form -->
                <ion-card>
                    <ion-card-header>
                        <ion-card-title>Select Details</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-grid>
                            <ion-row>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Client</ion-label>
                                        <ion-select v-model="selectedClient" placeholder="Select Client">
                                            <ion-select-option v-for="client in clients" :key="client"
                                                :value="client.id">
                                                {{ client.name }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Project</ion-label>
                                        <ion-select v-model="selectedProject" placeholder="Select Project">
                                            <ion-select-option v-for="project in projects" :key="project"
                                                :value="project.id">
                                                {{ project.project_id }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">BOM</ion-label>
                                        <ion-select v-model="selectedBOM" placeholder="Select BOM">
                                            <ion-select-option v-for="bom in boms" :key="bom" :value="bom.id">
                                                {{ bom.bom_number }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Production Planning</ion-label>
                                        <ion-select v-model="selectedPlanning" placeholder="Select Planning">
                                            <ion-select-option v-for="planning in plannings" :key="planning"
                                                :value="planning.id">
                                                {{ planning.production_planning_number }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Mark No</ion-label>
                                        <ion-select v-model="selectedMarkNo" placeholder="Select Mark No">
                                            <ion-select-option v-for="planningmarkno in planningMarkNos"
                                                :key="planningmarkno" :value="planningmarkno">
                                                {{ planningmarkno }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                        </ion-grid>

                        <ion-button expand="block" @click="handleMarkSelection" :disabled="!allSelectionsComplete"
                            class="mark-button">
                            Mark & Show Stages
                        </ion-button>
                    </ion-card-content>
                </ion-card>

                <!-- Stages List -->
                <div v-if="stages.length > 0" class="stages-section">
                    <h2>Production Stages</h2>
                    <StageItem v-for="stage in stages" :key="stage.id" :stage="stage" @updateStage="updateStage" />
                    <div v-if="stages.length > 0" class="save-btn-wrapper">
                        <ion-button expand="block" color="success" @click="saveStages">
                            Save Stages
                        </ion-button>
                    </div>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle
} from '@ionic/vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import StageItem from '../components/StageItem.vue';
import { useAppStore } from '../store';
import api from '@/services/api';

const store = useAppStore();

const clients = ref([]);
const projects = ref(['Project Alpha', 'Project Beta', 'Project Gamma']);
const boms = ref(['BOM-001', 'BOM-002', 'BOM-003']);
const plannings = ref(['Planning Q1', 'Planning Q2', 'Planning Q3']);
const planningMarkNos = ref([]);
const stages = ref([]);

const selectedClient = ref('');
const selectedProject = ref('');
const selectedBOM = ref('');
const selectedPlanning = ref('');
const selectedMarkNo = ref('');

// Fetch Clients from API
const loadClients = async () => {
    try {
        const res = await api.get('/getClients'); // Change your API URL
        clients.value = res.data.clients; // Ensure your API returns data.data
        console.log("clients.value", clients.value);

    } catch (error) {
        console.error("Error loading clients:", error);
    }
};

// Fetch Projects based on selected client
const loadProjects = async (clientId) => {
    try {
        const res = await api.get(`/getProjects?client_id=${clientId}`);
        projects.value = res.data.projects;
    } catch (error) {
        console.error("Error loading projects:", error);
    }
};
const loadBoms = async (projectId) => {
    try {
        const res = await api.get(`/getBoms?project_id=${projectId}`);
        boms.value = [res.data];
        console.log("boms", boms.value);

    } catch (error) {
        console.error("Error loading boms:", error);
    }
};
const loadPlannings = async (bom_id) => {
    try {
        const res = await api.get(`/getPlanning?bom_id=${bom_id}`);
        plannings.value = res.data;
        console.log("planning", plannings.value);

    } catch (error) {
        console.error("Error loading planning:", error);
    }
};
const loadMarknos = async (planning_id) => {
    try {
        const res = await api.get(`/getPlanningMarkNos?planning_id=${planning_id}`);
        planningMarkNos.value = res.data;
        console.log("planning", plannings.value);

    } catch (error) {
        console.error("Error loading planning:", error);
    }
}
const loadStages = async () => {
    try {
        const res = await api.get(`/getStages?planning_id=${selectedPlanning.value}&mark_no=${selectedMarkNo.value}`);
        stages.value = res.data;
        stages.value = stages.value.map(el => ({
            ...el,
            completed: el.stage_completed_date !== null
        }));

        console.log("stages", stages.value);

    } catch (error) {
        console.error("Error loading planning:", error);
    }
}
const saveStages = async () => {
    try {
        const payload = {
            planning_id: selectedPlanning.value,
            mark_no: selectedMarkNo.value,
            stages: stages.value
        };

        const res = await api.post('/saveStages', payload);

        console.log("Save response:", res.data);
        alert("Stages saved successfully!");

    } catch (error) {
        console.error("Error saving stages:", error);
        alert("Something went wrong while saving!");
    }
};

// Watch client selection → Load projects
watch(selectedClient, (newVal) => {
    if (newVal) {
        selectedProject.value = "";   // reset project
        projects.value = [];          // clear existing
        loadProjects(newVal);
    }
});
watch(selectedProject, (newVal) => {
    if (newVal) {
        selectedBOM.value = "";   // reset project
        boms.value = [];          // clear existing
        loadBoms(newVal);
    }
});
watch(selectedBOM, (newVal) => {
    if (newVal) {
        selectedPlanning.value = "";   // reset project
        plannings.value = [];          // clear existing
        loadPlannings(newVal);
    }
});
watch(selectedPlanning, (newVal) => {
    if (newVal) {
        selectedMarkNo.value = "";   // reset project
        planningMarkNos.value = [];          // clear existing
        loadMarknos(newVal);
    }
});
const allSelectionsComplete = computed(() => {
    return selectedClient.value &&
        selectedProject.value &&
        selectedBOM.value &&
        selectedPlanning.value &&
        selectedMarkNo.value;
});

const handleMarkSelection = () => {
    if (allSelectionsComplete.value) {
        store.setSelections(
            selectedClient.value,
            selectedProject.value,
            selectedBOM.value,
            selectedPlanning.value
        );
        loadStages()
        // store.loadStages();
    }
};
const updateStage = (updatedStage) => {
    stages.value = stages.value.map(s =>
        s.id === updatedStage.id ? updatedStage : s
    );
};
// Load Clients on Page Load
onMounted(() => {
    loadClients();
});
</script>

<style scoped>
ion-content {
    --padding-top: 20px;
}

.production-container {
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

h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 24px 0 16px;
}

ion-card {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    margin-bottom: 24px;
}

.mark-button {
    margin-top: 24px;
    --background: #4f46e5;
    font-weight: 600;
}

.stages-section {
    margin-top: 32px;
}
.save-btn-wrapper {
    margin-top: 24px;
}

</style>