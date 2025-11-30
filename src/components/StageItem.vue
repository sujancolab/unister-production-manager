<template>
  <ion-card :class="{ 'stage-completed': stage.completed }">
    <ion-card-content>
      <div class="stage-container">
        <div class="stage-info">
          <ion-icon 
            :icon="stage.completed ? checkmarkCircleIcon : ellipseOutlineIcon"
            :class="{ 'icon-completed': stage.completed, 'icon-pending': !stage.completed }"
          ></ion-icon>
          <span class="stage-name">{{ stage.stage }}</span>
        </div>
        
        <ion-button 
          :color="stage.completed ? 'success' : 'primary'"
          @click="toggleCompletion"
        >
          {{ stage.completed ? 'Completed' : 'Mark as Done' }}
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
// import { useAppStore } from '../store';

const props = defineProps({
  stage: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['updateStage'])

// const store = useAppStore();

const checkmarkCircleIcon = checkmarkCircle;
const ellipseOutlineIcon = ellipseOutline;

const toggleCompletion = () => {
//   store.toggleStageCompletion(props.stage.id);
  emit('updateStage', {
    ...props.stage,
    completed: !props.stage.completed,
  })
};
</script>

<style scoped>
ion-card {
  margin: 12px 0;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.stage-completed {
  background-color: #f0fdf4;
  border-color: #86efac;
}

.stage-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-name {
  font-weight: 500;
  color: #374151;
}

.stage-completed .stage-name {
  color: #166534;
}

.icon-completed {
  color: #16a34a;
  font-size: 24px;
}

.icon-pending {
  color: #9ca3af;
  font-size: 24px;
}
</style>