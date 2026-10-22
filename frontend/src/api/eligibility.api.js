import api from "./axios.js";

export const eligibilityApi = {
  analyze: () => api.post("/eligibility/analyze"),
  analyzeOne: (schemeId) => api.get(`/eligibility/scheme/${schemeId}`),
  explainWithAI: (schemeId) => api.post(`/eligibility/explain/${schemeId}`),
};