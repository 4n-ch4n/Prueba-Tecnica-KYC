import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  // En producción, esto debe restringirse al dominio específico de Cloudflare Pages
  origin: (origin) => {
    return origin; // Permitir cualquier origen de forma dinámica en desarrollo
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});
