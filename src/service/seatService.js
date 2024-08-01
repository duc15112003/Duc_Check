// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/saigonwaterbus/admin';
const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` };
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const dsGhe = async (page = 0, size = 73) => {
  try {
    const response = await apiClient.get('/seats', {
      params: { page, size },
      headers,
    });
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw error;
  }
};

const capNhatGhe = async (seat) => {
  try {
    const response = await apiClient.put('/seat/update',seat,{headers});
    return response.data.result;
  } catch (error) {
    console.error('Error fetching seat labels:', error);
    throw error;
  }

};


const seatService = {
 dsGhe,capNhatGhe
  };

export default seatService;
