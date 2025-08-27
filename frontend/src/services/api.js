import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (profileData) => 
    api.put('/auth/profile', profileData),
  
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

export const crmAPI = {
  getCustomers: (params = {}) => 
    api.get('/crm/customers', { params }),
  
  createCustomer: (customerData) => 
    api.post('/crm/customers', customerData),
  
  updateCustomer: (id, customerData) => 
    api.put(`/crm/customers/${id}`, customerData),
  
  deleteCustomer: (id) => 
    api.delete(`/crm/customers/${id}`),
  
  getCustomer: (id) => 
    api.get(`/crm/customers/${id}`),
};

export const shipmentsAPI = {
  getShipments: (params = {}) => 
    api.get('/shipments', { params }),
  
  createShipment: (shipmentData) => 
    api.post('/shipments', shipmentData),
  
  updateShipment: (id, shipmentData) => 
    api.put(`/shipments/${id}`, shipmentData),
  
  deleteShipment: (id) => 
    api.delete(`/shipments/${id}`),
  
  getShipment: (id) => 
    api.get(`/shipments/${id}`),
  
  trackShipment: (trackingNumber) => 
    api.get(`/shipments/track/${trackingNumber}`),
};

export const contractsAPI = {
  getContracts: (params = {}) => 
    api.get('/contracts', { params }),
  
  createContract: (contractData) => 
    api.post('/contracts', contractData),
  
  updateContract: (id, contractData) => 
    api.put(`/contracts/${id}`, contractData),
  
  deleteContract: (id) => 
    api.delete(`/contracts/${id}`),
  
  getContract: (id) => 
    api.get(`/contracts/${id}`),
};

export const analyticsAPI = {
  getDashboardData: () => 
    api.get('/analytics/dashboard'),
  
  getReports: (type, params = {}) => 
    api.get(`/analytics/reports/${type}`, { params }),
  
  getMetrics: (metric, params = {}) => 
    api.get(`/analytics/metrics/${metric}`, { params }),
};

export const adminAPI = {
  getUsers: (params = {}) => 
    api.get('/admin/users', { params }),
  
  createUser: (userData) => 
    api.post('/admin/users', userData),
  
  updateUser: (id, userData) => 
    api.put(`/admin/users/${id}`, userData),
  
  updateUserRole: (id, role) => 
    api.put(`/admin/users/${id}/role`, { role }),
  
  updateUserStatus: (id, isActive) => 
    api.put(`/admin/users/${id}/status`, { isActive }),
  
  deleteUser: (id) => 
    api.delete(`/admin/users/${id}`),
};

export default api;