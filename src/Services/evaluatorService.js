import API from './api';

const evaluatorService = {
  // Get queue of evaluations to review
  getQueue: () => {
    console.log('📡 Fetching evaluator queue');
    return API.get('/evaluator/queue');
  },

  // Get evaluation details for review
  getEvaluationForReview: (id) => {
    console.log('📡 Fetching evaluation for review:', id);
    return API.get(`/evaluator/evaluations/${id}`);
  },

  // Approve evaluation
  approveEvaluation: (id, comments) => {
    console.log('📡 Approving evaluation:', id);
    return API.post(`/evaluator/evaluations/${id}/approve`, { comments });
  },

  // Reject evaluation
  rejectEvaluation: (id, comments) => {
    console.log('📡 Rejecting evaluation:', id);
    return API.post(`/evaluator/evaluations/${id}/reject`, { comments });
  },
};

export const {
  getQueue,
  getEvaluationForReview,
  approveEvaluation,
  rejectEvaluation,
} = evaluatorService;

export default evaluatorService;