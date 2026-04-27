import { apiClient } from '../api/client';

export const AlertType = {
  SPEEDING: 'SPEEDING',
  ROUTE_DEVIATION: 'ROUTE_DEVIATION',
  GEOFENCE_ENTER: 'GEOFENCE_ENTER',
  GEOFENCE_EXIT: 'GEOFENCE_EXIT',
  SOS: 'SOS',
  MAINTENANCE_DUE: 'MAINTENANCE_DUE',
  DISCONNECT: 'DISCONNECT'
} as const;

export type AlertType = typeof AlertType[keyof typeof AlertType];

export interface Geofence {
  id: string;
  name: string;
  polygonCoordinates: number[][][];
  alertType: AlertType;
  isActive: boolean;
}

export const geofencesService = {
  async getAll(page = 1, limit = 10) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await apiClient.get('/api/v1/geofences', { params });
    // Assuming return struct is { data: [...], total }
    return response.data;
  },

  async create(data: Partial<Geofence>) {
    const response = await apiClient.post('/api/v1/geofences', data);
    return response.data;
  },

  async update(id: string, data: Partial<Geofence>) {
    const response = await apiClient.patch(`/api/v1/geofences/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/api/v1/geofences/${id}`);
    return response.data;
  }
};
