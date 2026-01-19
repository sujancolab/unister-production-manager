// // src/services/finalInspectionService.ts
// import axios from 'axios';

// export async function getFinalInspections() {
//   // Replace with your actual API endpoint
//   const { data } = await axios.get('/api/final-inspections');
//   return data.data || [];
// }

// export async function getFinalInspection(id: number) {
//   const { data } = await axios.get(`/api/final-inspections/${id}`);
//   return data.data;
// }

// export async function createFinalInspection(payload: any) {
//   const { data } = await axios.post('/api/final-inspections', payload);
//   return data.data;
// }

// export async function updateFinalInspection(id: number, payload: any) {
//   const { data } = await axios.put(`/api/final-inspections/${id}`, payload);
//   return data.data;
// }


// src/services/finalInspectionService.ts
import axios from 'axios';
import api from './api'; // Your API instance

export async function getFinalInspections() {
  try {
    const { data } = await api.get('/final-inspections');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching final inspections:', error);
    throw error;
  }
}

export async function getFinalInspection(id: number) {
  try {
    const { data } = await api.get(`/final-inspections/${id}`);
    return data.data;
  } catch (error) {
    console.error('Error fetching final inspection:', error);
    throw error;
  }
}

export async function getFinalInspectionByMarkNo(markNo: string) {
  try {
    // Option 1: If your backend supports query by mark_no
    const { data } = await api.get(`/final-inspections?mark_no=${markNo}`);
    return data.data?.[0] || null;
    
    // Option 2: Fetch all and filter client-side
    // const inspections = await getFinalInspections();
    // return inspections.find(inspection => inspection.mark_no === markNo) || null;
  } catch (error) {
    console.error('Error fetching final inspection by mark number:', error);
    throw error;
  }
}

export async function createFinalInspection(payload: any) {
  try {
    const { data } = await api.post('/final-inspections', payload);
    console.log("data",data);
    
    return data;
  } catch (error) {
    console.error('Error creating final inspection:', error);
    throw error;
  }
}

export async function updateFinalInspection(id: number, payload: any) {
  try {
    const { data } = await api.put(`/final-inspections/${id}`, payload);
    return data.data;
  } catch (error) {
    console.error('Error updating final inspection:', error);
    throw error;
  }
}

export async function deleteFinalInspection(id: number) {
  try {
    const { data } = await api.delete(`/final-inspections/${id}`);
    return data.data;
  } catch (error) {
    console.error('Error deleting final inspection:', error);
    throw error;
  }
}

export async function uploadInspectionAttachment(inspectionId: number, file: File) {
  try {
    const formData = new FormData();
    formData.append('attachment', file);
    formData.append('final_inspection_id', inspectionId.toString());
    
    const { data } = await api.post('/final-inspection-attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return data.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
}

export async function deleteInspectionAttachment(attachmentId: number) {
  try {
    const { data } = await api.delete(`/final-inspection-attachments/${attachmentId}`);
    return data.data;
  } catch (error) {
    console.error('Error deleting attachment:', error);
    throw error;
  }
}