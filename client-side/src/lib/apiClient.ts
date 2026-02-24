import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
  timeout: 31000, // Request timeout in milliseconds
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default apiClient;

export const resOk = (statusCode: number) => {
  return statusCode >= 200 && statusCode < 300;
}
