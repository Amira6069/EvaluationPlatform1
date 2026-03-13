import API from './api';

const evaluationService = {
  // Get my evaluations (for logged-in organization)
  getMyEvaluations: () => {
    console.log('📡 Fetching my evaluations');
    return API.get('/evaluations/my');
  },

  // Get evaluation by ID
  getEvaluationById: (id) => {
    console.log('📡 Fetching evaluation:', id);
    return API.get(`/evaluations/${id}`);
  },

  // Create new evaluation
  createEvaluation: (data) => {
    console.log('📡 Creating evaluation:', data);
    return API.post('/evaluations', data);
  },

  // Update evaluation
  updateEvaluation: (id, data) => {
    console.log('📡 Updating evaluation:', id);
    return API.put(`/evaluations/${id}`, data);
  },

  // Save responses (answers to criteria)
  saveResponses: (evaluationId, responses) => {
    console.log('📡 Saving responses for evaluation:', evaluationId);
    return API.post(`/evaluations/${evaluationId}/responses`, { responses });
  },

  // Submit evaluation
  submitEvaluation: (id) => {
    console.log('📡 Submitting evaluation:', id);
    return API.post(`/evaluations/${id}/submit`);
  },

  // Delete evaluation
  deleteEvaluation: (id) => {
    console.log('📡 Deleting evaluation:', id);
    return API.delete(`/evaluations/${id}`);
  },

  // Get evaluation result and certification
  getEvaluationResult: (id) => {
    console.log('📡 Fetching evaluation result:', id);
    return API.get(`/evaluations/${id}/result`);
  },

  // Get recommendations for an evaluation
  getRecommendations: (id) => {
    console.log('📡 Fetching recommendations for evaluation:', id);
    return API.get(`/evaluations/${id}/recommendations`);
  },
};

export const {
  getMyEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  saveResponses,
  submitEvaluation,
  deleteEvaluation,
  getEvaluationResult,
  getRecommendations,
} = evaluationService;

export default evaluationService;