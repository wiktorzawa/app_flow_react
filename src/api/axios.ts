import axios from "axios";

// URL API - domyślnie localhost:3001
const API_URL = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 sekund
});

export default axiosInstance;
