import API from './api';

const evaluationService = {
  getMyEvaluations: async () => {
    console.log('📡 Fetching my evaluations');
    const response = await API.get('/evaluations/my');
    return response.data;
  },

  getEvaluationById: async (id) => {
    console.log('📡 Fetching evaluation:', id);
    const response = await API.get(`/evaluations/${id}`);
    return response.data;
  },
   getResponses: async (evaluationId) => {
    console.log('📡 Fetching responses for evaluation:', evaluationId);
    const response = await API.get(`/evaluations/${evaluationId}/responses`);
    return response.data;
  },

  createEvaluation: async (evaluationData) => {
    console.log('📡 Creating evaluation:', evaluationData);
    const response = await API.post('/evaluations', evaluationData);
    console.log('📥 Backend response:', response.data);
    return response.data; // ✅ Returns { evaluationId, name, period, ... }
  },

  updateEvaluation: async (id, evaluationData) => {
    console.log('📡 Updating evaluation:', id);
    const response = await API.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },

  saveResponses: async (evaluationId, responses) => {
    console.log('📡 Saving responses for evaluation:', evaluationId);
    console.log('📦 Original responses:', responses);
    
    // ✅ Ensure responses is always an array
    let responsesArray;
    
    if (Array.isArray(responses)) {
      responsesArray = responses;
    } else if (responses && typeof responses === 'object') {
      responsesArray = Object.values(responses);
    } else {
      responsesArray = [];
    }
    
    console.log('📤 Sending responses array:', responsesArray);
    console.log('📊 Total responses:', responsesArray.length);
    
    const response = await API.post(`/evaluations/${evaluationId}/responses`, responsesArray);
    return response.data;
  },

  submitEvaluation: async (id) => {
    console.log('📡 Submitting evaluation:', id);
    const response = await API.post(`/evaluations/${id}/submit`);
    return response.data;
  },

  deleteEvaluation: async (id) => {
    console.log('📡 Deleting evaluation:', id);
    const response = await API.delete(`/evaluations/${id}`);
    return response.data;
  },

  getEvaluationResult: async (id) => {
    console.log('📡 Fetching evaluation result:', id);
    const response = await API.get(`/evaluations/${id}/result`);
    return response.data;
  },

  getRecommendations: async (id) => {
    console.log('📡 Fetching recommendations:', id);
    const response = await API.get(`/evaluations/${id}/recommendations`);
    return response.data;
  }
};

export default evaluationService;
