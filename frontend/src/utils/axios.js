import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://blog-post-wasu.onrender.com',
    withCredentials: true
});

export default instance;
