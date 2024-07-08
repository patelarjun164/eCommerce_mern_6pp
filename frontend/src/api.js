// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://shoppynexxa-backend.onrender.com/', // Set your base URL 
    withCredentials: true,
});

export default api;
