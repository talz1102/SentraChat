import axios from "axios";

const API = "http://127.0.0.1:8000";

// =========================
// REGISTER
// =========================
export const registerUser = (data) => {
  return axios.post(`${API}/auth/register`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// =========================
// LOGIN
// =========================
export const loginUser = (data) => {
  return axios.post(`${API}/auth/login`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};