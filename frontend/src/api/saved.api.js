import api from "./axios.js";

export const savedApi = {
  list: () => api.get("/saved"),
  save: (schemeId) => api.post(`/saved/${schemeId}`),
  unsave: (schemeId) => api.delete(`/saved/${schemeId}`),
  check: (schemeId) => api.get(`/saved/${schemeId}/check`),
};