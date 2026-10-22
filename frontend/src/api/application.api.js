import api from "./axios.js";

export const applicationApi = {
  list: () => api.get("/applications"),
  create: (schemeId, notes = "") => api.post("/applications", { schemeId, notes }),
  get: (schemeId) => api.get(`/applications/${schemeId}`),
  update: (schemeId, payload) => api.put(`/applications/${schemeId}`, payload),
  remove: (schemeId) => api.delete(`/applications/${schemeId}`),
};