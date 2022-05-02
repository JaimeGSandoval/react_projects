import axios from 'axios';
const BASE_URL = 'http://localhost:8000';

export default axios.create({
  baseURL: BASE_URL,
});

// Interceptors will be attached to axiosPrivate. The interceptors will work with our jwt tokens to refresh the token if our initial request is denied due to a expired token. It will continue to refresh a token on a set schedule.
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
