// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://shoppynexxa-backend.onrender.com/', // Set your base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
