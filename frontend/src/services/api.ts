import axios, { AxiosResponse } from 'axios';
import { Product, Filters, ProductsResponse, SettingResponse, CategorySample, CategoryInfo } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
});

export function setAdminKey(key: string): void {
  if (key) {
    api.defaults.headers.common['Authorization'] = `Bearer ${key}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const getProducts = (params?: Filters): Promise<AxiosResponse<ProductsResponse>> =>
  api.get('/products', { params });

export const getCategories = (): Promise<AxiosResponse<CategoryInfo[]>> =>
  api.get('/products/categories');

export const getCategorySamples = (): Promise<AxiosResponse<CategorySample[]>> =>
  api.get('/products/category-samples');

export const getProduct = (id: string): Promise<AxiosResponse<Product>> =>
  api.get(`/products/${id}`);

export const createProduct = (data: any): Promise<AxiosResponse<Product>> =>
  api.post('/products', data);

export const updateProduct = (id: string, data: any): Promise<AxiosResponse<Product>> =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/products/${id}`);

// Settings
export const getSetting = (key: string): Promise<AxiosResponse<SettingResponse>> =>
  api.get(`/settings/${key}`);

export const updateSetting = (key: string, value: string): Promise<AxiosResponse<SettingResponse>> =>
  api.put(`/settings/${key}`, { value });

export const uploadGalleryImage = (data: { url: string; public_id: string }): Promise<AxiosResponse<{ url: string }>> =>
  api.put('/settings/gallery-image', data);

// Cloudinary direct uploads
export const getCloudinarySignature = (folder: string = 'cake-affairs'): Promise<AxiosResponse<{
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}>> =>
  api.get('/cloudinary/signature', { params: { folder } });

export const requestOTP = (email: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/auth/otp', { email });

export const verifyOTP = (email: string, code: string): Promise<AxiosResponse<{ token: string }>> =>
  api.post('/auth/verify', { email, code });

export const logout = (): Promise<AxiosResponse<{ success: boolean }>> =>
  api.post('/auth/logout');

export default api;
