import api from './api';

const donService = {
  async createDon(data) {
    const response = await api.post('/dons', data);
    return response.data;
  },

  async getTotal() {
    const response = await api.get('/dons/total');
    return response.data;
  },

  async getMyDons() {
    const response = await api.get('/user/dons');
    return response.data;
  }
};

export default donService;
