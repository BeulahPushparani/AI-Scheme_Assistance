import api from "./axios.js";

export const chatApi = {
  ask: (question, schemeId = null) =>
    api.post("/chat/ask", { question, schemeId }),
  stats: () => api.get("/chat/stats"),
};