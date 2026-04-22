import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const loginUser = async (username, password) => {
  const response = await axios.post(API + '/login', { username, password });
  return response.data;
};

export const registerUser = async (username, password, role) => {
  const response = await axios.post(API + '/register', { username, password, role });
  return response.data;
};