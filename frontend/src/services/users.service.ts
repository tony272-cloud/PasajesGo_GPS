import { apiClient } from '../api/client';

export interface User {
  id: string;
  email: string;
  role: 'SUPERADMIN' | 'ORG_ADMIN' | 'OPERATOR' | 'BUS_DRIVER';
  organizationId?: string;
  organization?: { name: string };
  isActive: boolean;
}

export const usersService = {
  async getAll(page = 1, limit = 10) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  async create(data: Partial<User> & { password?: string }) {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  async update(id: string, data: Partial<User>) {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};
