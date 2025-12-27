import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Docker exposed port
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('Current API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
