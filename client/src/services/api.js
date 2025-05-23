import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to requests
api.interceptors.request.use(
    (config) => {
        // Don't add token for admin routes
        if (!config.url.startsWith('/admin')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getPortfolio = async () => {
    const response = await api.get('/dashboard/portfolio');
    return response.data;
};

export const getCompanies = async () => {
    const response = await api.get('/dashboard/companies');
    return response.data;
};

export const executeTrade = async (tradeData) => {
    const response = await api.post('/trade/execute', tradeData);
    return response.data;
};

export default api; 