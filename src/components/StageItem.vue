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
                        rows="3"
                    ></ion-textarea>
                </ion-item>
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

<script setup>
import { ref, computed } from 'vue';
import {
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonItem,
    IonLabel,
    IonTextarea
} from '@ionic/vue';
import { 
    checkmarkCircle, 
    closeCircle, 
    refresh, 
    person, 
    document, 
    alertCircle 
} from 'ionicons/icons';

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
};

const handleComplete = () => {
    isRejectMode.value = false;
    showNoteInput.value = true;
    noteText.value = '';
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
            completion_notes: null
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
            rejection_reason: null
        };
        emit('updateStage', updatedStage);
    }
    
    cancelNote();
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
}
</style>