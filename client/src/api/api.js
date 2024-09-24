// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/', 
});

API.defaults.withCredentials = true;

export const registerUser = async (userData) => {
    try {
        const response = await API.post('api/users/register', userData); 
        console.log(response.data);
      } catch (error) {
        throw error.response || error; 
        //console.error('Error registering user:', error);
      }
};

export const logoutFromServer = async () => {
    try {
      return await API.post('/api/users/logout'); 
    } catch (error) {
      console.error('Error logging out from server:', error);
      throw error; 
    }
};