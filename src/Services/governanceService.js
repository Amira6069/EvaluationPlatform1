import API from './api';

const governanceService = {
  /**
   * Get complete governance framework (Principles → Practices → Criteria)
   * GET /api/governance/framework
   */
  getFramework: async () => {
    console.log('📡 Fetching governance framework');
    const response = await API.get('/governance/framework');
    return response.data;
  },

  /**
   * Get all principles
   * GET /api/governance/principles
   */
  getPrinciples: async () => {
    console.log('📡 Fetching principles');
    const response = await API.get('/governance/principles');
    return response.data;
  },

  /**
   * Get practices for a principle
   * GET /api/governance/principles/{id}/practices
   */
  getPracticesByPrinciple: async (principleId) => {
    console.log('📡 Fetching practices for principle:', principleId);
    const response = await API.get(`/governance/principles/${principleId}/practices`);
    return response.data;
  },

  /**
   * Get criteria for a practice
   * GET /api/governance/practices/{id}/criteria
   */
  getCriteriaByPractice: async (practiceId) => {
    console.log('📡 Fetching criteria for practice:', practiceId);
    const response = await API.get(`/governance/practices/${practiceId}/criteria`);
    return response.data;
  }
};

export default governanceService;