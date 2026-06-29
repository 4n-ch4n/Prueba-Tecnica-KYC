import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  // En producción, restringe las solicitudes al origen configurado en las variables de entorno
  origin: (origin, c) => {
    const allowedOrigin = c.env?.CORS_ORIGIN;
    const isProduction = c.env?.NODE_ENV === 'production';

    if (isProduction && allowedOrigin) {
      return origin === allowedOrigin ? origin : undefined;
    }
    return origin; // En desarrollo local, permite cualquier origen dinámicamente
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});
