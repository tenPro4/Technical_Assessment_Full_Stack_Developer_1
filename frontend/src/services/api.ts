import axios from 'axios';
import { Item, CreateItemDto, UpdateItemDto } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3007/api',
});

export const itemsApi = {
  getAll: () => api.get<Item[]>('/item').then((res) => res.data),
  getById: (id: number) => api.get<Item>(`/item/${id}`).then((res) => res.data),
  create: (data: CreateItemDto) => api.post<Item>('/item', data).then((res) => res.data),
  update: (id: number, data: UpdateItemDto) => 
    api.put<Item>(`/item/${id}`, data).then((res) => res.data),
  delete: (id: number) => api.delete(`/item/${id}`).then((res) => res.data),
  deleteMany: (ids: number[]) => api.delete('/item/batch', { data: { ids } }).then((res) => res.data),
}; 