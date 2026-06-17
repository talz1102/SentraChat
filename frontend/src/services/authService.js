import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/auth",
});

export const registerUser = (userData) => {
  return API.post("/register", userData);
};