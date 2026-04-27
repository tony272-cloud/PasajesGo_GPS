import { apiClient } from '../api/client';

export interface Bus {
  id: string;
  plate: string;
  internalCode: string;
  capacity?: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  deviceToken?: string;
  organizationId: string;
}

export const busService = {
  async getAll(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);

    const response = await apiClient.get('/buses', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/buses/${id}`);
    return response.data;
  },

  async create(data: Partial<Bus>) {
    const response = await apiClient.post('/buses', data);
    return response.data;
  },

  async update(id: string, data: Partial<Bus>) {
    const response = await apiClient.patch(`/buses/${id}`, data);
    return response.data;
  },

  async rotateToken(id: string) {
    const response = await apiClient.post(`/buses/${id}/rotate-token`);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/buses/${id}`);
    return response.data;
  }
};
