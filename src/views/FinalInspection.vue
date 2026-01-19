<template>
    <ion-page>
        <Header />
        <Sidebar />

        <ion-content id="main-content" class="ion-padding" :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Production Process Final Inspection</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="production-container">
                <div class="page-header">
                    <ion-button fill="clear" color="medium" @click="goToDashboard" class="back-button">
                        <ion-icon slot="start" :icon="arrowBack"></ion-icon>
                        Back to Dashboard
                    </ion-button>
                    <h1>Production Process Final Inspection</h1>
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

                        <ion-button expand="block" @click="loadFinalInspectionData" :disabled="!allSelectionsComplete"
                            class="mark-button">
                            Load Inspection Data
                        </ion-button>
                    </ion-card-content>
                </ion-card>

                <!-- Final Inspection Section -->
                <div v-if="selectedMarkNo && finalInspectionData" class="final-inspection-section">
                    <h2>Final Inspection for Mark No: {{ selectedMarkNo }}</h2>
                    
                    <ion-card>
                        <ion-card-header>
                            <ion-card-title>Inspection Details</ion-card-title>
                        </ion-card-header>
                        
                        <ion-card-content>
                            <!-- Status Section -->
                            <div class="status-section mb-4">
                                <ion-label>
                                    <strong>Current Status:</strong> 
                                    <ion-badge :color="getStatusColor(finalInspectionData.status)" class="ml-2">
                                        {{ finalInspectionData.status }}
                                    </ion-badge>
                                </ion-label>
                                
                                <div v-if="finalInspectionData.completed_at" class="mt-2">
                                    <strong>Completed On:</strong> {{ formatDate(finalInspectionData.completed_at) }}
                                </div>
                                <div v-if="finalInspectionData.rejected_at" class="mt-2">
                                    <strong>Rejected On:</strong> {{ formatDate(finalInspectionData.rejected_at) }}
                                </div>
                            </div>

                            <!-- Inspection Form -->
                            <div v-if="!finalInspectionData.status || finalInspectionData.status === 'pending'">
                                <ion-item>
                                    <ion-label position="stacked">Inspection Result</ion-label>
                                    <ion-select v-model="inspectionResult" placeholder="Select Result">
                                        <ion-select-option value="approved">Approved</ion-select-option>
                                        <ion-select-option value="rejected">Rejected</ion-select-option>
                                    </ion-select>
                                </ion-item>

                                <ion-item class="mt-3">
                                    <ion-label position="stacked">
                                        {{ inspectionResult === 'rejected' ? 'Rejection Reason' : 'Inspection Notes' }}
                                        <span v-if="inspectionResult === 'rejected'" class="required">*</span>
                                    </ion-label>
                                    <ion-textarea
                                        v-model="inspectionNotes"
                                        :placeholder="inspectionResult === 'rejected' ? 'Enter reason for rejection...' : 'Enter inspection notes...'"
                                        :rows="4"
                                    ></ion-textarea>
                                </ion-item>

                                <!-- File Upload Section -->
                                <div class="upload-section mt-4">
                                    <ion-label class="upload-label">Attachments (Optional)</ion-label>
                                    <div class="file-input-wrapper">
                                        <input 
                                            ref="fileInput"
                                            type="file" 
                                            multiple 
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                            @change="onFileSelected"
                                            style="display: none"
                                        />
                                        <ion-button 
                                            expand="block" 
                                            fill="outline"
                                            size="small"
                                            @click="fileInput?.click()"
                                        >
                                            <ion-icon slot="start" name="cloud-upload"></ion-icon>
                                            Choose Files
                                        </ion-button>
                                    </div>
                                    <p class="file-hint">Max file size: 5MB per file</p>
                                </div>

                                <!-- Selected Files Preview -->
                                <div v-if="selectedFiles.length > 0" class="preview-section mt-4">
                                    <ion-label class="preview-label">Selected Files ({{ selectedFiles.length }})</ion-label>
                                    <div class="preview-grid">
                                        <div v-for="(file, index) in selectedFiles" :key="index" class="preview-card">
                                            <div v-if="file.type.includes('image')" class="image-preview">
                                                <img :src="file.preview" :alt="file.name" />
                                            </div>
                                            <div v-else class="file-preview">
                                                <ion-icon :name="getFileIcon(file.type)" class="file-icon"></ion-icon>
                                                <span>{{ getFileExtension(file.name) }}</span>
                                            </div>
                                            <div class="preview-footer">
                                                <div class="file-info">
                                                    <ion-text class="file-name">{{ file.name }}</ion-text>
                                                    <ion-text class="file-size">{{ formatFileSize(file.size) }}</ion-text>
                                                </div>
                                                <ion-button 
                                                    fill="clear" 
                                                    size="small"
                                                    @click="removeFile(index)"
                                                    class="remove-btn"
                                                >
                                                    <ion-icon slot="icon-only" name="close-circle"></ion-icon>
                                                </ion-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="action-buttons mt-4">
                                    <ion-button expand="block" color="success" @click="submitInspection" 
                                        :disabled="!inspectionResult || (inspectionResult === 'rejected' && !inspectionNotes.trim())">
                                        Submit Inspection
                                    </ion-button>
                                </div>
                            </div>

                            <!-- View Mode (When inspection is completed/rejected) -->
                            <div v-else>
                                <!-- Notes Display -->
                                <div class="notes-display mb-4">
                                    <strong>{{ finalInspectionData.status === 'rejected' ? 'Rejection Reason' : 'Inspection Notes' }}:</strong>
                                    <p>{{ finalInspectionData.comment || 'No notes provided' }}</p>
                                </div>

                                <!-- Attachments Display -->
                                <div v-if="finalInspectionData.attachments && finalInspectionData.attachments.length > 0" class="attachments-display">
                                    <strong>Attachments:</strong>
                                    <div class="attachments-grid">
                                        <div v-for="attachment in finalInspectionData.attachments" :key="attachment.id" 
                                             class="attachment-card" @click="viewAttachment(attachment)">
                                            <ion-icon :name="getFileIcon(attachment.file_type)" class="attachment-icon"></ion-icon>
                                            <span class="attachment-name">{{ attachment.file_name }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Reset Button -->
                                <div class="action-buttons mt-4">
                                    <ion-button expand="block" color="medium" @click="resetInspection">
                                        Reset Inspection
                                    </ion-button>
                                </div>
                            </div>
                        </ion-card-content>
                    </ion-card>
                </div>

                <!-- No Data Message -->
                <div v-else-if="selectedMarkNo && !finalInspectionData" class="no-data-section">
                    <ion-card>
                        <ion-card-content>
                            <div class="text-center">
                                <ion-icon name="document-text-outline" class="empty-icon"></ion-icon>
                                <h3>No Inspection Data Found</h3>
                                <p>No final inspection record found for Mark No: {{ selectedMarkNo }}</p>
                                <ion-button color="primary" @click="createNewInspection">
                                    Create New Inspection
                                </ion-button>
                            </div>
                        </ion-card-content>
                    </ion-card>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
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
    IonTextarea,
    IonBadge
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import api from '@/services/api';
// Import your service functions
import { 
    getFinalInspections, 
    getFinalInspection, 
    createFinalInspection, 
    updateFinalInspection 
} from '@/services/finalInspectionService';

const router = useRouter();

// Reactive data
const clients = ref([]);
const projects = ref([]);
const boms = ref([]);
const plannings = ref([]);
const planningMarkNos = ref([]);

const selectedClient = ref('');
const selectedProject = ref('');
const selectedBOM = ref('');
const selectedPlanning = ref('');
const selectedMarkNo = ref('');

// Inspection data
const finalInspectionData = ref(null);
const inspectionResult = ref('');
const inspectionNotes = ref('');
const selectedFiles = ref([]);
const fileInput = ref(null);

// Fetch data functions
const loadClients = async () => {
    try {
        const res = await api.get('/getClients');
        clients.value = res.data.clients;
    } catch (error) {
        console.error("Error loading clients:", error);
    }
};

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
    } catch (error) {
        console.error("Error loading boms:", error);
    }
};

const loadPlannings = async (bom_id) => {
    try {
        const res = await api.get(`/getPlanning?bom_id=${bom_id}`);
        plannings.value = res.data;
    } catch (error) {
        console.error("Error loading planning:", error);
    }
};

const loadMarknos = async (planning_id) => {
    try {
        const res = await api.get(`/getPlanningMarkNos?planning_id=${planning_id}`);
        planningMarkNos.value = res.data;
    } catch (error) {
        console.error("Error loading mark numbers:", error);
    }
};

const loadFinalInspectionData = async () => {
    if (!selectedMarkNo.value) return;
    
    try {
        // Method 1: Use your getFinalInspections service
        // const allInspections = await getFinalInspections();
        // finalInspectionData.value = allInspections.find(
        //     inspection => inspection.mark_no === selectedMarkNo.value
        // ) || null;
        
        // Method 2: If you prefer a direct API call
        const response = await api.get(`/final-inspections?mark_no=${selectedMarkNo.value}`);
        finalInspectionData.value = response.data[0] || null;
        
        if (finalInspectionData.value) {
            inspectionResult.value = finalInspectionData.value.status;
            inspectionNotes.value = finalInspectionData.value.comment || '';
        } else {
            inspectionResult.value = '';
            inspectionNotes.value = '';
        }
        
        selectedFiles.value = [];
    } catch (error) {
        console.error("Error loading final inspection data:", error);
        finalInspectionData.value = null;
    }
};

const submitInspection = async () => {
    if (!inspectionResult.value) {
        alert('Please select an inspection result');
        return;
    }

    if (inspectionResult.value === 'rejected' && !inspectionNotes.value.trim()) {
        alert('Please provide rejection reason');
        return;
    }

    try {
        const payload = {
            mark_no: selectedMarkNo.value,
            planning_id: selectedPlanning.value,
            project_id: selectedProject.value,
            bom_id: selectedBOM.value,
            client_id: selectedClient.value,
            status: inspectionResult.value,
            notes: inspectionNotes.value,
            completed_at: inspectionResult.value === 'approved' ? new Date().toISOString() : null,
            rejected_at: inspectionResult.value === 'rejected' ? new Date().toISOString() : null,
            // You might want to add user information
            // inspected_by: currentUser.value.id
        };

        // Handle file uploads separately if needed
        // Since your service might not handle FormData, you can upload files separately
        
        if (finalInspectionData.value && finalInspectionData.value.id) {
            // Update existing inspection using your service
            const updated = await updateFinalInspection(finalInspectionData.value.id, payload);
            finalInspectionData.value = updated;
            
            // Upload attachments separately if needed
            await uploadAttachments(finalInspectionData.value.id);
        } else {
            // Create new inspection using your service
            const created = await createFinalInspection(payload);
            finalInspectionData.value = created;
            console.log("created",created);
            
            
            // Upload attachments separately if needed
            if (created.id) {
                await uploadAttachments(created.id);
            }
        }

        alert('Inspection saved successfully!');
        // loadFinalInspectionData(); // Reload data
    } catch (error) {
        console.error("Error saving inspection:", error);
        alert('Failed to save inspection');
    }
};

const uploadAttachments = async (inspectionId) => {
    if (selectedFiles.value.length === 0) return;
    
    try {
        for (const fileObj of selectedFiles.value) {
            if (fileObj.file) {
                const formData = new FormData();
                formData.append('attachment', fileObj.file);
                formData.append('final_inspection_id', inspectionId);
                
                // Use direct API call for file upload
                await api.post('/final-inspection-attachments', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error uploading attachments:", error);
        // You might want to handle this more gracefully
    }
};

const resetInspection = async () => {
    if (!confirm('Are you sure you want to reset this inspection?')) return;

    try {
        if (finalInspectionData.value && finalInspectionData.value.id) {
            // You might need to create a delete function in your service
            await api.delete(`/final-inspections/${finalInspectionData.value.id}`);
            alert('Inspection reset successfully');
            loadFinalInspectionData();
        }
    } catch (error) {
        console.error("Error resetting inspection:", error);
        alert('Failed to reset inspection');
    }
};

const createNewInspection = () => {
    inspectionResult.value = '';
    inspectionNotes.value = '';
    selectedFiles.value = [];
    finalInspectionData.value = {
        status: 'pending',
        notes: '',
        attachments: []
    };
};

const onFileSelected = async (event) => {
    const input = event.target;
    if (input.files) {
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is 5MB`);
                continue;
            }

            let preview = '';
            if (file.type.includes('image')) {
                preview = URL.createObjectURL(file);
            }

            selectedFiles.value.push({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: preview,
                file: file
            });
        }
    }
};

const removeFile = (index) => {
    selectedFiles.value.splice(index, 1);
};

const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('msword')) return 'document-text';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'table';
    if (mimeType.includes('image')) return 'image';
    return 'attach';
};

const getFileExtension = (fileName) => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    return ext;
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getStatusColor = (status) => {
    switch(status) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        default: return 'medium';
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const viewAttachment = (attachment) => {
    window.open(attachment.file_url, '_blank');
};

const allSelectionsComplete = computed(() => {
    return selectedClient.value &&
        selectedProject.value &&
        selectedBOM.value &&
        selectedPlanning.value &&
        selectedMarkNo.value;
});

const goToDashboard = () => {
    router.push('/dashboard');
};

// Watchers remain the same
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

watch(selectedMarkNo, (newVal) => {
    if (newVal) {
        loadFinalInspectionData();
    }
});

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

.final-inspection-section {
    margin-top: 32px;
}

.required {
    color: #ef4444;
    margin-left: 4px;
}

/* Upload Styles */
.upload-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-top: 16px;
}

.upload-label {
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 12px;
    font-size: 14px;
}

.file-hint {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    margin-bottom: 0;
}

/* Preview Styles */
.preview-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-top: 16px;
}

.preview-label {
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 12px;
    font-size: 14px;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
}

.preview-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    position: relative;
    display: flex;
    flex-direction: column;
}

.image-preview {
    width: 100%;
    height: 100px;
    overflow: hidden;
    background: #f0f0f0;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-preview {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    gap: 4px;
}

.file-icon {
    font-size: 32px;
    color: #666;
}

.preview-footer {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-top: 1px solid #eee;
    gap: 8px;
}

.file-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.file-name {
    font-size: 11px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.file-size {
    font-size: 10px;
    color: #999;
}

.remove-btn {
    margin: 0;
    flex-shrink: 0;
}

/* Attachments Display */
.attachments-display {
    margin-top: 16px;
}

.attachments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 8px;
}

.attachment-card {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.attachment-card:hover {
    background-color: #f5f5f5;
}

.attachment-icon {
    font-size: 20px;
    margin-right: 8px;
    color: #666;
}

.attachment-name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Empty State */
.no-data-section .text-center {
    text-align: center;
    padding: 32px;
}

.empty-icon {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 16px;
}

.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
.ml-2 { margin-left: 8px; }

/* Responsive */
@media (max-width: 576px) {
    .preview-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
    
    .attachments-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
}
</style>