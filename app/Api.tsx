import axios from 'axios';  
import AsyncStorage from "@react-native-async-storage/async-storage";  

const API_URL = 'https://adetbackend.onrender.com/api/';  // Make sure this is the correct URL  
const api = axios.create({ baseURL: API_URL });  

// Attach JWT token to requests  
api.interceptors.request.use(async (config) => {  
    const token = await AsyncStorage.getItem('token');  
    if (token) config.headers.Authorization = `Bearer ${token}`;  
    return config;  
});  

export const getUsers = async () => {  
    const { data } = await api.get('/user');  
    return data;  
};  

export const getUserById = async (id: number) => {  
    const { data } = await api.get(`/user/${id}`);  
    return data;  
};  

export const createUser = async (username: string, password: string) => {  
    await api.post('/user', { username, password });  
};  

export const updateUser = async (id: number, username: string) => {  
    await api.put(`/user/${id}`, { username });  
};  

export const deleteUser = async (id: number) => {  
    await api.delete(`/user/${id}`);  
};  

export default api;  