import { apiClient } from '../api/client';

export interface RouteStop {
  name: string;
  sequenceOrder: number;
  lng: number;
  lat: number;
  radiusMeters?: number;
}

export interface Route {
  id: string;
  name: string;
  colorHex?: string;
  pathCoordinates?: number[][];
  stops?: RouteStop[];
  isActive: boolean;
  organizationId: string;
}

export const routesService = {
  async getAll(page = 1, limit = 10) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await apiClient.get('/api/v1/routes', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/api/v1/routes/${id}`);
    return response.data;
  },

  async create(data: Partial<Route>) {
    const response = await apiClient.post('/api/v1/routes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Route>) {
    const response = await apiClient.patch(`/api/v1/routes/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/api/v1/routes/${id}`);
    return response.data;
  }
};
