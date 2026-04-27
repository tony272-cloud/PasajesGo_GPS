import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (token, user) => {
    localStorage.setItem('auth_token', token);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: () => {
    // This will be called on app load. We can decode the token or call /me endpoint.
    // For MVP, just check if token exists. A robust implementation would verify it against the backend.
    const token = localStorage.getItem('auth_token');
    if (token) {
       // Mock decoding or rely on initial fetch to populate user
       set({ isAuthenticated: true, isLoading: false });
    } else {
       set({ isAuthenticated: false, isLoading: false });
    }
  }
}));

// Listen to interceptor events
window.addEventListener('auth:unauthorized', () => {
  useAuthStore.getState().logout();
});
