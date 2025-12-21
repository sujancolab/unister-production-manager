<template>
    <ion-card :class="['stage-card', stageStatusClass]">
        <ion-card-content>
            <div class="stage-header">
                <div class="stage-info">
                    <h3>{{ stage.stage_name || stage.stage }}</h3>
                    <ion-badge :color="statusBadgeColor" class="status-badge">
                        {{ statusText }}
                    </ion-badge>
                </div>
                <div class="stage-actions">
                    <ion-button 
                        v-if="!stage.rejected && !stage.completed"
                        fill="solid" 
                        color="danger" 
                        size="small"
                        @click="handleReject"
                    >
                        <ion-icon slot="start" :icon="closeCircle"></ion-icon>
                        Reject
                    </ion-button>
                    <ion-button 
                        v-if="!stage.rejected && !stage.completed"
                        fill="solid" 
                        color="success" 
                        size="small"
                        @click="handleComplete"
                    >
                        <ion-icon slot="start" :icon="checkmarkCircle"></ion-icon>
                        Complete
                    </ion-button>
                    <ion-button 
                        v-if="stage.rejected || stage.completed"
                        fill="outline" 
                        color="medium" 
                        size="small"
                        @click="handleReset"
                    >
                        <ion-icon slot="start" :icon="refresh"></ion-icon>
                        Reset
                    </ion-button>
                </div>
            </div>

            <div v-if="stage.completed" class="stage-details">
                <div class="detail-row">
                    <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                    <span>Completed on: {{ formatDate(stage.stage_completed_date) }}</span>
                </div>
                <div v-if="stage.completed_by" class="detail-row">
                    <ion-icon :icon="person" color="medium"></ion-icon>
                    <span>By: {{ stage.completed_by?.name }}</span>
                </div>
                <div v-if="stage.completion_notes" class="detail-row notes">
                    <ion-icon :icon="document" color="medium"></ion-icon>
                    <span>{{ stage.completion_notes }}</span>
                </div>
            </div>

            <div v-if="stage.rejected" class="stage-details rejected-details">
                <div class="detail-row">
                    <ion-icon :icon="closeCircle" color="danger"></ion-icon>
                    <span>Rejected on: {{ formatDate(stage.stage_rejected_date) }}</span>
                </div>
                <div v-if="stage.rejected_by" class="detail-row">
                    <ion-icon :icon="person" color="medium"></ion-icon>
                    <span>By: {{ stage.rejected_by?.name }}</span>
                </div>
                <div v-if="stage.rejection_reason" class="detail-row notes">
                    <ion-icon :icon="alertCircle" color="danger"></ion-icon>
                    <span><strong>Reason:</strong> {{ stage.rejection_reason }}</span>
                </div>
            </div>

            <!-- Note Input (shown when marking complete or reject) -->
            <div v-if="showNoteInput" class="note-input-section">
                <ion-item>
                    <ion-label position="stacked">
                        {{ isRejectMode ? 'Rejection Reason' : 'Completion Notes' }}
                        <span v-if="isRejectMode" class="required">*</span>
                    </ion-label>
                    <ion-textarea
                        v-model="noteText"
                        :placeholder="isRejectMode ? 'Enter reason for rejection...' : 'Enter completion notes (optional)...'"
                        :rows="3"
                    ></ion-textarea>
                </ion-item>

                <!-- File Upload Section -->
                <div class="upload-section">
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
                    <p class="file-hint">Max file size: 5MB</p>
                </div>

                <!-- Attachment Preview -->
                <div v-if="selectedFiles.length > 0" class="preview-section">
                    <ion-label class="preview-label">Selected Files</ion-label>
                    <div class="preview-grid">
                        <div v-for="(file, index) in selectedFiles" :key="index" class="preview-card">
                            <!-- Image Preview -->
                            <div v-if="file.type.includes('image')" class="image-preview">
                                <img :src="file.preview" :alt="file.name" />
                            </div>

                            <!-- PDF/Document Preview -->
                            <div v-else class="file-preview">
                                <ion-icon :name="getFileIcon(file.type)" class="file-icon"></ion-icon>
                                <span>{{ getFileExtension(file.name) }}</span>
                            </div>

                            <!-- File Name and Remove Button -->
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

                <div class="note-actions">
                    <ion-button fill="clear" @click="cancelNote">Cancel</ion-button>
                    <ion-button 
                        :color="isRejectMode ? 'danger' : 'success'" 
                        @click="confirmAction"
                        :disabled="isRejectMode && !noteText.trim()"
                    >
                        Confirm {{ isRejectMode ? 'Rejection' : 'Completion' }}
                    </ion-button>
                </div>
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonItem,
    IonLabel,
    IonTextarea,
    IonText
} from '@ionic/vue';
import { 
    checkmarkCircle, 
    closeCircle, 
    refresh, 
    person, 
    document, 
    alertCircle 
} from 'ionicons/icons';
import stageAttachmentService from '@/services/stageAttachmentService';

interface FilePreview {
    name: string;
    size: number;
    type: string;
    preview: string;
    file?: File;  // Add actual File object
}

const props = defineProps({
    stage: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['updateStage']);

const showNoteInput = ref(false);
const isRejectMode = ref(false);
const noteText = ref('');
const selectedFiles = ref<FilePreview[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const stageStatusClass = computed(() => {
    if (props.stage.rejected) return 'stage-rejected';
    if (props.stage.completed) return 'stage-completed';
    return 'stage-pending';
});

const statusBadgeColor = computed(() => {
    if (props.stage.rejected) return 'danger';
    if (props.stage.completed) return 'success';
    return 'medium';
});

const statusText = computed(() => {
    if (props.stage.rejected) return 'Rejected';
    if (props.stage.completed) return 'Completed';
    return 'Pending';
});

const handleReject = () => {
    isRejectMode.value = true;
    showNoteInput.value = true;
    noteText.value = '';
    selectedFiles.value = [];
};

const handleComplete = () => {
    isRejectMode.value = false;
    showNoteInput.value = true;
    noteText.value = '';
    selectedFiles.value = [];
};

const handleReset = () => {
    const updatedStage = {
        ...props.stage,
        completed: false,
        rejected: false,
        status: 'pending',
        stage_completed_date: null,
        stage_rejected_date: null,
        completion_notes: null,
        rejection_reason: null,
        completed_by: null,
        rejected_by: null
    };
    emit('updateStage', updatedStage);
};

const cancelNote = () => {
    showNoteInput.value = false;
    noteText.value = '';
    isRejectMode.value = false;
    selectedFiles.value = [];
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const onFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is 5MB`);
                continue;
            }

            let preview = '';
            if (file.type.includes('image')) {
                preview = await stageAttachmentService.generatePreviewUrl(file);
            }

            selectedFiles.value.push({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: preview,
                file: file  // Store actual File object
            });
        }
    }
};

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1);
};

const getFileIcon = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('msword')) return 'document-text';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'table';
    return 'attach';
};

const getFileExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    return ext;
};

const formatFileSize = (bytes: number): string => {
    return stageAttachmentService.formatFileSize(bytes);
};

const confirmAction = () => {
    const currentDate = new Date().toISOString();
    
    if (isRejectMode.value) {
        // Reject stage
        const updatedStage = {
            ...props.stage,
            rejected: true,
            completed: false,
            status: 'rejected',
            stage_rejected_date: currentDate,
            rejection_reason: noteText.value,
            rejected_by: 'Current User', // Replace with actual user info
            stage_completed_date: null,
            completion_notes: null,
            selectedFiles: selectedFiles.value
        };
        emit('updateStage', updatedStage);
    } else {
        // Complete stage
        const updatedStage = {
            ...props.stage,
            completed: true,
            rejected: false,
            status: 'completed',
            stage_completed_date: currentDate,
            completion_notes: noteText.value || null,
            completed_by: 'Current User', // Replace with actual user info
            stage_rejected_date: null,
            rejection_reason: null,
            selectedFiles: selectedFiles.value
        };
        emit('updateStage', updatedStage);
    }
    
    cancelNote();
};

const formatDate = (dateString: string | null) => {
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
</script>

<style scoped>
.stage-card {
    margin-bottom: 16px;
    border-left: 4px solid;
    transition: all 0.3s ease;
}

.stage-pending {
    border-left-color: #9ca3af;
}

.stage-completed {
    border-left-color: #10b981;
    background-color: #f0fdf4;
}

.stage-rejected {
    border-left-color: #ef4444;
    background-color: #fef2f2;
}

.stage-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 12px;
}

.stage-info {
    flex: 1;
}

.stage-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.status-badge {
    font-size: 12px;
    padding: 4px 12px;
}

.stage-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.stage-details {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.rejected-details {
    background-color: rgba(239, 68, 68, 0.05);
    padding: 12px;
    border-radius: 8px;
    border-top: none;
    margin-top: 12px;
}

.detail-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #4b5563;
}

.detail-row ion-icon {
    margin-top: 2px;
    flex-shrink: 0;
}

.detail-row.notes {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
}

.detail-row.notes span {
    font-style: italic;
}

.note-input-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #e5e7eb;
}

.note-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
}

.required {
    color: #ef4444;
    margin-left: 4px;
}

ion-button {
    font-weight: 600;
}

/* Attachment Upload Styles */
.upload-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-top: 16px;

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
}

.preview-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-top: 16px;

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

        .image-preview {
            width: 100%;
            height: 100px;
            overflow: hidden;
            background: #f0f0f0;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
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

            .file-icon {
                font-size: 32px;
                color: #666;
            }

            span {
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }
        }

        .preview-footer {
            padding: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-top: 1px solid #eee;
            gap: 8px;

            .file-info {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 2px;

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
            }

            .remove-btn {
                margin: 0;
                flex-shrink: 0;
            }
        }
    }
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .stage-header {
        flex-direction: column;
    }
    
    .stage-actions {
        width: 100%;
        justify-content: flex-start;
    }
    
    .stage-actions ion-button {
        flex: 1;
    }

    .preview-section .preview-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}
</style>