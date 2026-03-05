// src/http/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // normaliza
    const status = err?.response?.status;
    const data = err?.response?.data;
    return Promise.reject({ status, data, message: err?.message ?? "Erro" });
  }
);