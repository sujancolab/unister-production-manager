import api from './api';

export const getPackingListFormData = async () => {
    const response = await api.get('/packing-list/form-data');
    return response.data;
};

export const getPackingListProjects = async (clientId: number) => {
    const response = await api.get('/packing-list/projects', { params: { client_id: clientId } });
    return response.data;
};

export const storePackingList = async (data: any) => {
    const response = await api.post('/packing-list/store', data);
    return response.data;
};