import api from './client';

export const getRecommendations = async (payload = {}) => {
  const response = await api.post('/recommend', payload);
  return response.data;
};

export const getRecommendationHistory = async (page = 1) => {
  const response = await api.get(`/recommendations/history?page=${page}`);
  return response.data;
};

export const getRoles = async (search = '', page = 1) => {
  const url = search 
    ? `/roles?search=${encodeURIComponent(search)}&page=${page}`
    : `/roles?page=${page}`;
  const response = await api.get(url);
  return response.data;
};

export const getRoleDetail = async (id) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};
