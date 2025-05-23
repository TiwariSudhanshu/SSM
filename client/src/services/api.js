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

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return Promise.reject({ message: 'No response from server' });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            return Promise.reject({ message: 'Failed to make request' });
        }
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
    try {
        const response = await api.get('/admin/companies');
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const executeTrade = async (tradeData) => {
    try {
        const response = await api.post('/trade/execute', tradeData);
        return response.data;
    } catch (error) {
        console.error('Error executing trade:', error);
        throw error;
    }
};

export default api; 