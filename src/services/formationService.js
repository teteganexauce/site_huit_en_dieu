import api from './api';

const formationService = {
  async getApprentissage(inscriptionId) {
    const response = await api.get(`/inscriptions/${inscriptionId}/apprentissage`);
    return response.data;
  },

  async getCoursCourant(inscriptionId, coursId) {
    const response = await api.get(`/inscriptions/${inscriptionId}/cours/${coursId}`);
    return response.data;
  },

  async completerCours(coursId) {
    const response = await api.put(`/cours/${coursId}/completer`);
    return response.data;
  },

  async getEvaluation(moduleId) {
    const response = await api.get(`/modules/${moduleId}/evaluation`);
    return response.data;
  },

  async getEvaluationById(evaluationId) {
    const response = await api.get(`/evaluations/${evaluationId}`);
    return response.data;
  },

  async soumettreEvaluation(evaluationId, reponses) {
    const response = await api.post(`/evaluations/${evaluationId}/soumettre`, { reponses });
    return response.data;
  },
};

export default formationService;
