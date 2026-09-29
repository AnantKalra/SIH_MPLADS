import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

export const getStats = async () => {
  const res = await api.get('/stats');
  return res.data;
};

export const getProjects = async (page = 1, limit = 20, sort_by = 'risk_score', filters = {}) => {
  const res = await api.get('/projects', { params: { page, limit, sort_by, ...filters }});
  return res.data;
};

export const searchProjects = async (q) => {
  const res = await api.get('/projects/search', { params: { q }});
  return res.data;
};

export const generateProjectSummary = async (projectData) => {
  const res = await api.post('/projects/summary', projectData);
  return res.data;
};
