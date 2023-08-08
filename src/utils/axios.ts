import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const service = axios.create();

// Request interceptors
service.interceptors.request.use(
  (config: AxiosRequestConfig) => config,
  (error: any) => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    console.log(response);

    // do something
  },
  (error: any) => Promise.reject(error)
);

export default service;
