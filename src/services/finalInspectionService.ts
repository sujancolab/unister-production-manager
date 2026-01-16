// src/services/finalInspectionService.ts
import axios from 'axios';

export async function getFinalInspections() {
  // Replace with your actual API endpoint
  const { data } = await axios.get('/api/final-inspections');
  return data.data || [];
}

export async function getFinalInspection(id: number) {
  const { data } = await axios.get(`/api/final-inspections/${id}`);
  return data.data;
}

export async function createFinalInspection(payload: any) {
  const { data } = await axios.post('/api/final-inspections', payload);
  return data.data;
}

export async function updateFinalInspection(id: number, payload: any) {
  const { data } = await axios.put(`/api/final-inspections/${id}`, payload);
  return data.data;
}
