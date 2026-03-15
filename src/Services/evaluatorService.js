import API from './api';

const evaluatorService = {
  /**
   * Get evaluation queue (all submitted evaluations)
   * GET /api/evaluator/queue
   */
  getQueue: async () => {
    console.log('📡 Fetching evaluator queue');
    const response = await API.get('/evaluator/queue');
    return response.data;
  },

  /**
   * Approve evaluation
   * POST /api/evaluator/evaluations/{id}/approve
   */
  approveEvaluation: async (id, comments) => {
    console.log('✅ Approving evaluation:', id);
    const response = await API.post(`/evaluator/evaluations/${id}/approve`, {
      comments: comments || ''
    });
    return response.data;
  },

  /**
   * Reject evaluation
   * POST /api/evaluator/evaluations/{id}/reject
   */
  rejectEvaluation: async (id, reason) => {
    console.log('❌ Rejecting evaluation:', id);
    const response = await API.post(`/evaluator/evaluations/${id}/reject`, {
      reason: reason || 'Not specified'
    });
    return response.data;
  }
};

export default evaluatorService;