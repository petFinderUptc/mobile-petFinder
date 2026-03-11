import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants/config';
import { getItem, setItem, removeItem } from '../../utils/storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          await setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          await setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        await removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        await removeItem(STORAGE_KEYS.USER_DATA);
        
        // Emit event for navigation to login
        // This will be handled by AuthContext
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Ha ocurrido un error';

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

export default apiClient;
