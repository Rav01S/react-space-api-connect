import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8000',
  withXSRFToken: true
})

axiosClient.interceptors.request.use(res => {
  res.headers.Authorization = "Bearer " + localStorage.getItem('token');
  return res;
})

axiosClient.interceptors.response.use(res => res, err => {
  if (err.status === 401 && err.response.data.message === "Login failed") {
    localStorage.removeItem('token');
    window.location.reload()
  }
  return Promise.reject(err);
})