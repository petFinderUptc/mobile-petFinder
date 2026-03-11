import apiClient from './api/apiClient';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import { STORAGE_KEYS } from '../constants/config';
import { setItem, getItem, removeItem } from '../utils/storage';

export const register = async (userData) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
  
  if (response.data.access_token) {
    await setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
  }
  if (response.data.refresh_token) {
    await setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
  }
  if (response.data.user) {
    await setItem(STORAGE_KEYS.USER_DATA, response.data.user);
  }
  
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  if (response.data.access_token) {
    await setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
  }
  if (response.data.refresh_token) {
    await setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
  }
  if (response.data.user) {
    await setItem(STORAGE_KEYS.USER_DATA, response.data.user);
  }
  
  return response.data;
};

export const logout = async () => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    await removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await removeItem(STORAGE_KEYS.USER_DATA);
  }
};

export const getCurrentUser = async () => {
  const storedUser = await getItem(STORAGE_KEYS.USER_DATA);
  if (storedUser) {
    return storedUser;
  }
  
  const response = await apiClient.get(AUTH_ENDPOINTS.ME);
  await setItem(STORAGE_KEYS.USER_DATA, response.data);
  return response.data;
};

export const isAuthenticated = async () => {
  const token = await getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async () => {
  const refresh = await getItem(STORAGE_KEYS.REFRESH_TOKEN);
  
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
    refreshToken: refresh,
  });
  
  if (response.data.access_token) {
    await setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
  }
  if (response.data.refresh_token) {
    await setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
  }
  
  return response.data;
};
