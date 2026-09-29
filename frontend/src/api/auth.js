import api, { setTokens, clearTokens } from './client';

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.access) {
    setTokens(response.data.access, response.data.refresh);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.access) {
    setTokens(response.data.access, response.data.refresh);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutUser = () => {
  clearTokens();
};
