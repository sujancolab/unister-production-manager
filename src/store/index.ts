import api from '@/services/api';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    loggedInUser: '',
    token: null,
    sidebarCollapsed: false,
    selectedClient: '',
    selectedProject: '',
    selectedBOM: '',
    selectedPlanning: '',
    stages: [],
    showStages: false
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const response = await api.post('/login', {
          username,
          password
        });

        const token = response.data.token;
        const user = response.data.user;

        // Save token in localStorage
        localStorage.setItem('token', token);

        // Store in Pinia state
        this.loggedInUser = user;
        this.token = token;

        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || "Login failed" 
        };
      }
    },

    logout() {
      this.loggedInUser = null;
      this.token = null;

      localStorage.removeItem('token');

      this.selectedClient = '';
      this.selectedProject = '';
      this.selectedBOM = '';
      this.selectedPlanning = '';
      this.stages = [];
      this.showStages = false;
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    setSelections(client, project, bom, planning) {
      this.selectedClient = client;
      this.selectedProject = project;
      this.selectedBOM = bom;
      this.selectedPlanning = planning;
    },

    loadStages() {
      this.stages = [
        { id: 1, name: 'Material Procurement', completed: false },
        { id: 2, name: 'Quality Check', completed: false },
        { id: 3, name: 'Assembly Line 1', completed: false },
        { id: 4, name: 'Assembly Line 2', completed: false },
        { id: 5, name: 'Testing & QA', completed: false },
        { id: 6, name: 'Packaging', completed: false },
        { id: 7, name: 'Final Inspection', completed: false },
        { id: 8, name: 'Dispatch', completed: false }
      ];
      this.showStages = true;
    },

    toggleStageCompletion(stageId) {
      const stage = this.stages.find(s => s.id === stageId);
      if (stage) {
        stage.completed = !stage.completed;
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.loggedInUser,
    allSelectionsComplete: (state) => 
      state.selectedClient && 
      state.selectedProject && 
      state.selectedBOM && 
      state.selectedPlanning
  }
});
