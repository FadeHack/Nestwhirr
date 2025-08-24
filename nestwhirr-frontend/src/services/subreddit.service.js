import api from './api';

export const subnestService = {
  async getSubnests() {
    const response = await api.get('/subnests');
    return response.data;
  },

  async getSubnest(name) {
    const response = await api.get(`/n/${name}`);
    return response.data;
  },

  async createSubnest(data) {
    const response = await api.post('/subnests', data);
    return response.data;
  },

  async updateSubnest(name, data) {
    const response = await api.put(`/n/${name}`, data);
    return response.data;
  },

  async subscribeToSubnest(name) {
    const response = await api.post(`/n/${name}/subscribe`);
    return response.data;
  },

  async unsubscribeFromSubnest(name) {
    const response = await api.post(`/n/${name}/unsubscribe`);
    return response.data;
  },

  async getSubnestModerators(name) {
    const response = await api.get(`/n/${name}/moderators`);
    return response.data;
  },

  async searchSubnests(query) {
    const response = await api.get('/subnests/search', {
      params: { q: query },
    });
    return response.data;
  },
}; 