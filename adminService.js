import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllBookings = async (params = {}) => {
  const response = await api.get('/admin/bookings', { params });
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await api.put(`/admin/bookings/${id}`, statusData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};
