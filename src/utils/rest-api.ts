import { useStore } from '@/zustand/store';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, {
    ...config,
    ...(useStore.getState().user.token && {
    headers: {
      'Authorization': `Bearer ${useStore.getState().user.token}`,
    },
    }),
  });
  return response.data;
};
export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await api.post(url, data, {
    ...config,
    ...(useStore.getState().user.token && {
      headers: {
        'Authorization': `Bearer ${useStore.getState().user.token}`,
      },
    }),
  });
  return response.data;
};
export const put = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await api.put(url, data, {
    ...config,
    ...(useStore.getState().user.token && {
      headers: {
        'Authorization': `Bearer ${useStore.getState().user.token}`,
      },
    }),
  });
  return response.data;
};
export const patch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await api.patch(url, data, {
    ...config,
    ...(useStore.getState().user.token && {
      headers: {
        'Authorization': `Bearer ${useStore.getState().user.token}`,
      },
    }),
  });
  return response.data;
};
export const del = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.delete(url, {
    ...config,
    ...(useStore.getState().user.token && {
      headers: {
        'Authorization': `Bearer ${useStore.getState().user.token}`,
      },
    }),
  });
  return response.data;
};
export default api;