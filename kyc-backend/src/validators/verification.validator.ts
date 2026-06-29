import { zValidator } from '@hono/zod-validator';
import { createVerificationSchema, verificationIdSchema } from '../schemas/verification.schema';
import { BadRequestError } from '../utils/errors';

export const validateCreateVerification = zValidator(
  'form',
  createVerificationSchema,
  (result) => {
    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestError('Error de validación en el formulario de verificación', formattedErrors);
    }
  }
);

export const validateVerificationId = zValidator(
  'param',
  verificationIdSchema,
  (result) => {
    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestError('Error de validación en los parámetros de la URL', formattedErrors);
    }
  }
);
