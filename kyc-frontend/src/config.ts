const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';
export const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
