import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/saigonwaterbus/admin';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LoginProcess = async (username, password) => {
    try {
        console.log("Username:", username);
        console.log("Password:", password);

        const response = await apiClient.post('/login', { username, password });

        console.log("Response data:", response.data);

        localStorage.setItem('token', response.data.result.token);
        localStorage.setItem('us', username);

        return "oke";
    } catch (error) {
        if (error.response) {
            // Client received an error response (5xx, 4xx)
            console.error('Response error data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // Client never received a response, or request never left
            console.error('No response received:', error.request);
        } else {
            // Anything else
            console.error('Error message:', error.message);
        }
        throw error;
    }
};

const LoginService = {
  LoginProcess
};

export default LoginService;
