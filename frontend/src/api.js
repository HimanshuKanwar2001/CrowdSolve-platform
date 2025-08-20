import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({ baseURL: url });

// Add JWT automatically if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/");
export const getPosts = () => API.get("/feature/posts");
export const createPost = (data) => API.post("/feature/posts", data);
export const addComment = (postId, data) =>
  API.post(`/feature/posts/${postId}/comment`, data);
export const upvote = (commentId) =>
  API.post(`/feature/posts/${commentId}/comment/upvote`);
export const downvote = (commentId) =>
  API.post(`/feature/posts/${commentId}/comment/downvote`);
