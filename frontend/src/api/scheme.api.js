import api from "./axios.js";

export const schemeApi = {
  list: (params = {}) => api.get("/schemes", { params }),
  get: (schemeId) => api.get(`/schemes/${schemeId}`),
};