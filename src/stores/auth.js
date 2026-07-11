import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role?.value === 'admin'
  },
  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        if (response.data) {
          this.token = response.data.token;
          this.user = response.data.user;
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    async register(userData) {
      try {
        const response = await authService.register(userData);
        if (response.data) {
          this.token = response.data.token;
          this.user = response.data.user;
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout failed on backend, cleaning up locally anyway', error);
      } finally {
        this.token = null;
        this.user = null;
      }
    },
    async fetchProfile() {
      if (!this.token) return;
      try {
        const data = await authService.getProfile();
        // L'API retourne `{ data: { ... } }` selon le UserResource
        this.user = data.data || data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    }
  }
});
