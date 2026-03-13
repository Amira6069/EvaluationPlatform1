import API from './api';

// ===== USER MANAGEMENT =====
export const getAllUsers = () => {
  console.log('📡 Admin API: GET /admin/users');
  return API.get('/admin/users');  // Changed from /users/all
};

export const getUserById = (id) => {
  console.log('📡 Admin API: GET /admin/users/' + id);
  return API.get(`/admin/users/${id}`);
};

export const createUser = (userData) => {
  console.log('📡 Admin API: POST /admin/users', userData);
  return API.post('/admin/users', userData);
};

export const updateUser = (id, userData) => {
  console.log('📡 Admin API: PUT /admin/users/' + id);
  return API.put(`/admin/users/${id}`, userData);
};

export const deleteUser = (id) => {
  console.log('📡 Admin API: DELETE /admin/users/' + id);
  return API.delete(`/admin/users/${id}`);
};

export const toggleUserStatus = (id) => {
  console.log('📡 Admin API: PATCH /admin/users/' + id + '/toggle-status');
  return API.patch(`/admin/users/${id}/toggle-status`);
};

// ===== EVALUATION MANAGEMENT =====
export const getAllEvaluations = () => {
  console.log('📡 Admin API: GET /admin/evaluations');
  return API.get('/admin/evaluations');  // Changed
};

export const getEvaluationStats = () => {
  console.log('📡 Admin API: GET /admin/stats');
  return API.get('/admin/stats');
};

// ===== DASHBOARD STATS =====
export const getDashboardStats = () => {
  console.log('📡 Admin API: GET /admin/stats');
  return API.get('/admin/stats');
};