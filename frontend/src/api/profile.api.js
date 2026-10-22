import api from "./axios.js";

export const profileApi = {
  get: () => api.get("/profile"),
  save: (payload) => api.put("/profile", payload),
  confirm: () => api.post("/profile/confirm"),
};