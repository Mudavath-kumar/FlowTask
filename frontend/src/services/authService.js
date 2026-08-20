import api from '../api/axios';

export const authService = {
  async signup(data) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
