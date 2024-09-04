import axios from 'axios';

const API = axios.create({
  baseURL: '/api/', // Adjust based on your backend setup
});

export const registerUser = async (userData) => {
    try {
        const response = await API.post('api/users/register', userData); // No need to specify localhost here
        console.log(response.data);
      } catch (error) {
        throw error.response || error; 
        //console.error('Error registering user:', error);
      }
};