import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 60000 });

export const fetchNews = (params = {}) => api.get("/news", { params }).then((r) => r.data);
export const fetchTrending = () => api.get("/news/trending").then((r) => r.data);
export const fetchArticle = (id) => api.get(`/news/${id}`).then((r) => r.data);
export const fetchComments = (id) => api.get(`/news/${id}/comments`).then((r) => r.data);
export const postComment = (id, payload) =>
  api.post(`/news/${id}/comments`, payload).then((r) => r.data);
export const subscribeNewsletter = (email) =>
  api.post("/newsletter/subscribe", { email }).then((r) => r.data);
export const fetchWeekly = () => api.get("/weekly-summary").then((r) => r.data);
export const generateArticle = (topic) =>
  api.post("/news/generate", null, { params: topic ? { topic } : {} }).then((r) => r.data);
export const seedNews = (count = 6) =>
  api.post("/news/seed", null, { params: { count } }).then((r) => r.data);
