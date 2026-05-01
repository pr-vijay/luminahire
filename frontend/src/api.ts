const API_BASE = 'http://localhost:8080/api';

async function post(url: string, body: any) {
  const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}
async function get(url: string) { const res = await fetch(`${API_BASE}${url}`); return res.json(); }
async function put(url: string, body: any) {
  const res = await fetch(`${API_BASE}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}
async function del(url: string) { const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE' }); return res.json(); }

export const api = {
  // Auth
  auth: {
    register: (data: any) => post('/auth/register', data),
    login: (data: any) => post('/auth/login', data),
  },

  // AI
  analyzeResume: (resume: string, jobDescription: string) => post('/ai/analyze-resume', { resume, jobDescription }),
  extractSkills: (resume: string) => post('/ai/extract-skills', { resume }),
  chat: (message: string, context = '') => post('/ai/chat', { message, context }),
  generateCoverLetter: (resume: string, jobDescription: string, company: string) => post('/ai/cover-letter', { resume, jobDescription, company }),
  matchJobsForResume: (resume: string, location = '') => post('/ai/match-jobs', { resume, location }),
  aiStatus: () => get('/ai/status'),

  // Jobs
  searchJobs: (query = '', location = '', experienceLevel = '') => {
    const p = new URLSearchParams(); if (query) p.set('query', query); if (location) p.set('location', location); if (experienceLevel) p.set('experienceLevel', experienceLevel);
    return get(`/jobs/search?${p.toString()}`);
  },

  // Dashboard
  dashboardStats: () => get('/dashboard/stats'),
  dashboardActivity: () => get('/dashboard/activity'),

  // Profile — persisted to backend DB
  getProfile: (email: string) => get(`/profile?email=${encodeURIComponent(email)}`),
  saveProfile: (data: any) => post('/profile', data),

  // Applications — persisted to backend DB
  getApplications: (email: string) => get(`/applications?email=${encodeURIComponent(email)}`),
  addApplication: (data: any) => post('/applications', data),
  updateAppStatus: (id: number, status: string) => put(`/applications/${id}/status`, { status }),
  deleteApplication: (id: number) => del(`/applications/${id}`),
  appStats: (email: string) => get(`/applications/stats?email=${encodeURIComponent(email)}`),
};
