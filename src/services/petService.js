import apiClient from './api/apiClient';
import { PET_ENDPOINTS } from '../constants/apiEndpoints';

export const getPets = async (filters = {}) => {
  const response = await apiClient.get(PET_ENDPOINTS.GET_ALL, {
    params: filters,
  });
  return response.data;
};

export const getPetById = async (id) => {
  const response = await apiClient.get(PET_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

export const createPet = async (petData) => {
  const response = await apiClient.post(PET_ENDPOINTS.CREATE, petData);
  return response.data;
};

export const updatePet = async (id, petData) => {
  const response = await apiClient.put(PET_ENDPOINTS.UPDATE(id), petData);
  return response.data;
};

export const deletePet = async (id) => {
  await apiClient.delete(PET_ENDPOINTS.DELETE(id));
};

export const getMyPets = async () => {
  const response = await apiClient.get(PET_ENDPOINTS.MY_REPORTS);
  return response.data;
};

export const uploadPetImage = async (imageData) => {
  const response = await apiClient.post(
    PET_ENDPOINTS.UPLOAD_IMAGE,
    imageData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const searchPets = async (searchParams) => {
  const response = await apiClient.get(PET_ENDPOINTS.SEARCH, {
    params: searchParams,
  });
  return response.data;
};
