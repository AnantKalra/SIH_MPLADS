import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getStats = async () => {
  const res = await api.get('/stats');
  return res.data;
};

export const getProjects = async (page = 1, limit = 20, sort_by = 'risk_score') => {
  const res = await api.get('/projects', { params: { page, limit, sort_by }});
  return res.data;
};

export const searchProjects = async (q) => {
  const res = await api.get('/projects/search', { params: { q }});
  return res.data;
};
