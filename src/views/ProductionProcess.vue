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
                <div class="page-header">
                    <ion-button fill="clear" color="medium" @click="goToDashboard" class="back-button">
                        <ion-icon slot="start" :icon="arrowBack"></ion-icon>
                        Back to Dashboard
                    </ion-button>
                    <h1>Production Process</h1>
                </div>

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
                                        <ion-select v-model="selectedClient" placeholder="Select Client"
                                            :disabled="selectionLoading.clients">
                                            <ion-select-option v-for="client in clients" :key="client"
                                                :value="client.id">
                                                {{ client.name }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                    <div v-if="selectionLoading.clients" class="select-loader">
                                        <ion-spinner name="crescent" />
                                        <span>Loading clients...</span>
                                    </div>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Project</ion-label>
                                        <ion-select v-model="selectedProject" placeholder="Select Project"
                                            :disabled="selectionLoading.projects || !selectedClient">
                                            <ion-select-option v-for="project in projects" :key="project"
                                                :value="project.id">
                                                {{ project.project_id }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                    <div v-if="selectionLoading.projects" class="select-loader">
                                        <ion-spinner name="crescent" />
                                        <span>Loading projects...</span>
                                    </div>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">BOM</ion-label>
                                        <ion-select v-model="selectedBOM" placeholder="Select BOM"
                                            :disabled="selectionLoading.boms || !selectedProject">
                                            <ion-select-option v-for="bom in boms" :key="bom" :value="bom.id">
                                                {{ bom.bom_number }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                    <div v-if="selectionLoading.boms" class="select-loader">
                                        <ion-spinner name="crescent" />
                                        <span>Loading BOMs...</span>
                                    </div>
                                </ion-col>

                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Production Planning</ion-label>
                                        <ion-select v-model="selectedPlanning" placeholder="Select Planning"
                                            :disabled="selectionLoading.plannings || !selectedBOM">
                                            <ion-select-option v-for="planning in plannings" :key="planning"
                                                :value="planning.id">
                                                {{ planning.production_planning_number }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                    <div v-if="selectionLoading.plannings" class="select-loader">
                                        <ion-spinner name="crescent" />
                                        <span>Loading planning...</span>
                                    </div>
                                </ion-col>
                                <ion-col size="12" size-md="6">
                                    <ion-item>
                                        <ion-label position="stacked">Mark No</ion-label>
                                        <ion-select v-model="selectedMarkNo" placeholder="Select Mark No"
                                            :disabled="selectionLoading.markNos || !selectedPlanning">
                                            <ion-select-option v-for="planningmarkno in planningMarkNos"
                                                :key="planningmarkno" :value="planningmarkno">
                                                {{ planningmarkno }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                    <div v-if="selectionLoading.markNos || selectionLoading.finalInspection" class="select-loader">
                                        <ion-spinner name="crescent" />
                                        <span>{{ selectionLoading.markNos ? 'Loading mark numbers...' : 'Loading inspection...' }}</span>
                                    </div>
                                </ion-col>
                            </ion-row>
                        </ion-grid>

                        <ion-button expand="block" @click="handleMarkSelection" :disabled="!allSelectionsComplete || selectionLoading.stages"
                            class="mark-button">
                            {{ selectionLoading.stages ? 'Loading Stages...' : 'Mark & Show Stages' }}
                        </ion-button>
                    </ion-card-content>
                </ion-card>

                <!-- Tabbed Interface: Stages / Final Inspection -->
                <div v-if="stages.length > 0" class="stages-section">
                    <ion-segment v-model="activeTab" class="mb-3">
                        <ion-segment-button value="stages">
                            <ion-label>Stages</ion-label>
                        </ion-segment-button>
                        <ion-segment-button value="inspection">
                            <ion-label>Final Inspection</ion-label>
                        </ion-segment-button>
                    </ion-segment>

                    <div v-if="activeTab === 'stages'">
                        <h2>Production Stages</h2>
                        <StageItem v-for="stage in stages" :key="stage.id" :stage="stage" @updateStage="updateStage" />
                        <div v-if="stages.length > 0" class="save-btn-wrapper">
                            <ion-button expand="block" color="success" @click="saveStages">
                                Save Stages
                            </ion-button>
                        </div>
                    </div>

                    <div v-else-if="activeTab === 'inspection'">
                        <h2>Final Inspection</h2>
                        <ion-card>
                            <ion-card-content>
                                <div v-if="finalInspection">
                                    <ion-label>
                                        <strong>Status:</strong> <span :class="statusClass(finalInspection.status)">{{ finalInspection.status }}</span><br>
                                        <strong>Mark No:</strong> {{ finalInspection.mark_no }}<br>
                                        <strong>Created:</strong> {{ formatDate(finalInspection.created_at) }}
                                    </ion-label>
                                    <ion-button expand="block" color="primary" @click="viewFinalInspection(finalInspection)">View</ion-button>
                                </div>
                                <div v-else>
                                    <ion-label>No final inspection found for this mark.</ion-label>
                                    <ion-button expand="block" color="success" @click="createFinalInspection">Create</ion-button>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </div>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
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
    IonTitle,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSpinner
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import StageItem from '../components/StageItem.vue';
import { useAppStore } from '../store';
import api from '@/services/api';
import { getFinalInspection } from '@/services/finalInspectionService';

const store = useAppStore();
const router = useRouter();

// Reactive data
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
const selectionLoading = reactive({
    clients: false,
    projects: false,
    boms: false,
    plannings: false,
    markNos: false,
    finalInspection: false,
    stages: false
});

const activeTab = ref('stages');
const finalInspection = ref(null);

// Fetch Clients from API
const loadClients = async () => {
    selectionLoading.clients = true;
    try {
        const res = await api.get('/getClients');
        clients.value = res.data.clients;
        console.log("clients.value", clients.value);
    } catch (error) {
        console.error("Error loading clients:", error);
    } finally {
        selectionLoading.clients = false;
    }
};

// Fetch Projects based on selected client
const loadProjects = async (clientId) => {
    selectionLoading.projects = true;
    try {
        const res = await api.get(`/getProjects?client_id=${clientId}`);
        projects.value = res.data.projects;
    } catch (error) {
        console.error("Error loading projects:", error);
    } finally {
        selectionLoading.projects = false;
    }
};

const loadBoms = async (projectId) => {
    selectionLoading.boms = true;
    try {
        const res = await api.get(`/getBoms?project_id=${projectId}`);
        boms.value = [res.data];
        console.log("boms", boms.value);
    } catch (error) {
        console.error("Error loading boms:", error);
    } finally {
        selectionLoading.boms = false;
    }
};

const loadPlannings = async (bom_id) => {
    selectionLoading.plannings = true;
    try {
        const res = await api.get(`/getPlanning?bom_id=${bom_id}`);
        plannings.value = res.data;
        console.log("planning", plannings.value);
    } catch (error) {
        console.error("Error loading planning:", error);
    } finally {
        selectionLoading.plannings = false;
    }
};

const loadMarknos = async (planning_id) => {
    selectionLoading.markNos = true;
    try {
        const res = await api.get(`/getPlanningMarkNos?planning_id=${planning_id}`);
        planningMarkNos.value = res.data;
        console.log("planning", plannings.value);
    } catch (error) {
        console.error("Error loading planning:", error);
    } finally {
        selectionLoading.markNos = false;
    }
}

const loadStages = async () => {
    selectionLoading.stages = true;
    try {
        const res = await api.get(`/getStages?planning_id=${selectedPlanning.value}&mark_no=${selectedMarkNo.value}`);
        stages.value = res.data;
        
        // Map stages with completed and rejected status
        stages.value = stages.value.map(el => ({
            ...el,
            completed: el.stage_completed_date !== null,
            rejected: el.stage_rejected_date !== null,
            status: el.stage_rejected_date !== null 
                ? 'rejected' 
                : el.stage_completed_date !== null 
                ? 'completed' 
                : 'pending'
        }));

        console.log("stages", stages.value);
    } catch (error) {
        console.error("Error loading stages:", error);
    } finally {
        selectionLoading.stages = false;
    }
}

const fetchFinalInspection = async () => {
    if (!selectedMarkNo.value) return;
    selectionLoading.finalInspection = true;
    try {
        finalInspection.value = await getFinalInspection(selectedMarkNo.value);
    } catch {
        finalInspection.value = null;
    } finally {
        selectionLoading.finalInspection = false;
    }
};

const viewFinalInspection = (inspection) => {
    router.push({ name: 'FinalInspectionDetail', params: { id: inspection.id } });
};

const createFinalInspection = () => {
    router.push({ name: 'FinalInspectionCreate', query: {
        mark_no: selectedMarkNo.value,
        project_id: selectedProject.value,
        planning_id: selectedPlanning.value,
        bom_id: selectedBOM.value,
        client_id: selectedClient.value
    }});
};

const statusClass = (status) => {
    if (status === 'Completed') return 'text-success';
    if (status === 'Rejected') return 'text-danger';
    return 'text-warning';
};

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const saveStages = async () => {
    try {
        const formData = new FormData();
        formData.append('planning_id', selectedPlanning.value);
        formData.append('mark_no', selectedMarkNo.value);

        let fileCounter = 0;
        let totalFiles = 0;
        
        // Process each stage
        stages.value.forEach((stage, index) => {
            formData.append(`stages[${index}][id]`, stage.id);
            formData.append(`stages[${index}][completed]`, stage.completed ? '1' : '0');
            formData.append(`stages[${index}][rejected]`, stage.rejected ? '1' : '0');
            formData.append(`stages[${index}][completion_notes]`, stage.completion_notes || '');
            formData.append(`stages[${index}][rejection_reason]`, stage.rejection_reason || '');
            formData.append(`stages[${index}][stage_id]`, stage.id);

            // Handle file uploads - Flatten files with stage reference
            if (stage.selectedFiles && Array.isArray(stage.selectedFiles) && stage.selectedFiles.length > 0) {
                stage.selectedFiles.forEach((fileObj) => {
                    // If we have the actual File object, use it
                    if (fileObj.file && fileObj.file instanceof File) {
                        console.log('Adding file to FormData:', {
                            name: fileObj.file.name,
                            size: fileObj.file.size,
                            stage_id: stage.id
                        });
                        
                        // Use a simple flat key structure
                        formData.append(
                            `files[${fileCounter}][file]`,
                            fileObj.file,
                            fileObj.file.name
                        );
                        formData.append(
                            `files[${fileCounter}][stage_id]`,
                            stage.id
                        );
                        fileCounter++;
                        totalFiles++;
                    } else {
                        console.warn('File object missing or invalid:', fileObj);
                    }
                });
            }
        });

        console.log('FormData ready. Total files:', totalFiles);
        console.log('FormData entries:', Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `File: ${v.name}` : v]));

        const res = await api.post('/saveStages', formData);

        console.log("Save response:", res.data);
        alert("Stages saved successfully!");
        // Reload stages to see updated data
        loadStages();
    } catch (error) {
        console.error("Error saving stages:", error);
        alert("Something went wrong while saving!");
    }
};

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
    }
};

const updateStage = (updatedStage) => {
    stages.value = stages.value.map(s =>
        s.id === updatedStage.id ? updatedStage : s
    );
};

// Navigate back to dashboard
const goToDashboard = () => {
    router.push('/dashboard'); // Change '/dashboard' to your actual dashboard route
};

// Watchers - ALL declared AFTER the refs they depend on
watch(selectedMarkNo, fetchFinalInspection);

watch(selectedClient, (newVal) => {
    if (newVal) {
        selectedProject.value = "";
        projects.value = [];
        loadProjects(newVal);
    }
});

watch(selectedProject, (newVal) => {
    if (newVal) {
        selectedBOM.value = "";
        boms.value = [];
        loadBoms(newVal);
    }
});

watch(selectedBOM, (newVal) => {
    if (newVal) {
        selectedPlanning.value = "";
        plannings.value = [];
        loadPlannings(newVal);
    }
});

watch(selectedPlanning, (newVal) => {
    if (newVal) {
        selectedMarkNo.value = "";
        planningMarkNos.value = [];
        loadMarknos(newVal);
    }
});

// Load Clients on Page Load
onMounted(() => {
    loadClients();
    fetchFinalInspection();
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

.page-header {
    margin-bottom: 24px;
}

.back-button {
    margin-bottom: 12px;
    font-weight: 600;
    --padding-start: 0;
}

.back-button ion-icon {
    font-size: 20px;
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

.text-success {
    color: #10b981;
}

.text-danger {
    color: #ef4444;
}

.text-warning {
    color: #f59e0b;
}

.select-loader {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px 0;
    color: #6b7280;
    font-size: 13px;
}
</style>
