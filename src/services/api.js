import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor — handle 401/403 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // If we are not on the login page, redirect
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ===== AUTH =====
export const loginRequest = (cedula, password) =>
    api.post('/login', { cedula, password });

// ===== USERS =====
export const getUsers = () => api.get('/users');

export const getUser = (id) => api.get(`/users/${id}`);

export const createUser = (data) => api.post('/users', data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

// ===== CARS =====
export const getCars = () => api.get('/cars');

export const getCar = (id) => api.get(`/cars/${id}`);

export const createCar = (formData) =>
    api.post('/cars', formData);

export const updateCar = (id, formData) =>
    api.put(`/cars/${id}`, formData);

export const deleteCar = (id) => api.delete(`/cars/${id}`);

// ===== BIKES =====
export const getBikes = () => api.get('/bikes');

export const getBike = (id) => api.get(`/bikes/${id}`);

export const createBike = (formData) =>
    api.post('/bikes', formData);

export const updateBike = (id, formData) =>
    api.put(`/bikes/${id}`, formData);

export const deleteBike = (id) => api.delete(`/bikes/${id}`);

export default api;
