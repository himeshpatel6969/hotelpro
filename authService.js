import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('hotelpro_token', response.data.token);
    localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('hotelpro_token', response.data.token);
    localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('hotelpro_token');
  localStorage.removeItem('hotelpro_user');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  if (response.data.user) {
    localStorage.setItem('hotelpro_user', JSON.stringify(response.data.user));
  }
  return response.data;
};
