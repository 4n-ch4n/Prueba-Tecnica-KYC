import { Context } from 'hono';
import { AppError } from '../utils/errors';
import { HTTPException } from 'hono/http-exception';

export const errorHandler = (err: Error, c: Context) => {
  // Evitar loguear errores esperados en consola durante la ejecución de los tests
  const isTest = typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.env?.NODE_ENV === 'test';
  
  if (!isTest) {
    console.error(`[Global Error Handler]: ${err.name} - ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Errores controlados de la aplicación (AppError)
  if (err instanceof AppError) {
    return c.json(
      {
        success: false,
        message: err.message,
        errors: err.errors || null,
        timestamp: new Date().toISOString(),
      },
      err.statusCode as any
    );
  }

  // Errores nativos de Hono (HTTPException)
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        timestamp: new Date().toISOString(),
      },
      err.status
    );
  }

  // Errores no controlados (Errores del sistema o librerías externas)
  return c.json(
    {
      success: false,
      message: 'Ha ocurrido un error interno en el servidor.',
      timestamp: new Date().toISOString(),
    },
    500
  );
};
