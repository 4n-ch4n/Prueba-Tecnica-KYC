import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { verificationRoutes } from './routes/verification.routes';
import { openApiSpec } from './config/openapi';
import { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Middlewares Globales
app.use('*', corsMiddleware);

// Protección Edge contra solicitudes masivas (prevención de Out-Of-Memory en Workers)
app.use('/verification*', async (c, next) => {
  const contentLength = c.req.header('content-length');
  if (contentLength && parseInt(contentLength, 10) > 11 * 1024 * 1024) {
    return c.json(
      {
        success: false,
        message: 'Payload Too Large: El tamaño de la solicitud excede el límite de 11MB para evitar sobrecarga de memoria.',
        timestamp: new Date().toISOString(),
      },
      413
    );
  }
  await next();
});

// Documentación Swagger OpenAPI
app.get('/doc', (c) => c.json(openApiSpec));
app.get('/swagger', swaggerUI({ url: '/doc' }));

// Rutas
app.route('/verification', verificationRoutes);

// Endpoint de salud / info base
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Plataforma Mini KYC API - Cloudflare Workers Edge',
    timestamp: new Date().toISOString(),
  });
});

// Manejo Centralizado de Errores
app.onError(errorHandler);

// Ruta no encontrada (404)
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `La ruta '${c.req.path}' no existe.`,
      timestamp: new Date().toISOString(),
    },
    404
  );
});

export default app;
