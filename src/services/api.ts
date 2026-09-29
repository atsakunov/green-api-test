import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://4100.api.green-api.com',
});

export const api = {
  get: <T>(url: string, signal?: AbortSignal): Promise<T> =>
    instance.get<T>(url, { signal }).then((res) => res.data),

  post: <T>(url: string, body?: unknown, signal?: AbortSignal): Promise<T> =>
    instance.post<T>(url, body, { signal }).then((res) => res.data),

  delete: <T>(url: string, signal?: AbortSignal): Promise<T> =>
    instance.delete<T>(url, { signal }).then((res) => res.data),
};
