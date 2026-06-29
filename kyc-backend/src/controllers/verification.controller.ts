import { Context } from 'hono';
import { z } from 'zod';
import { D1VerificationRepository } from '../repositories/d1-verification.repository';
import { MockStorageRepository, R2StorageRepository } from '../repositories/storage.repository';
import { VerificationService } from '../services/verification.service';
import { createVerificationSchema, verificationIdSchema } from '../schemas/verification.schema';
import { NotFoundError } from '../utils/errors';
import { Env } from '../types';

export class VerificationController {
  
  private static getService(c: Context<{ Bindings: Env }>): VerificationService {
    // Inyección de dependencias por request
    const verificationRepo = new D1VerificationRepository(c.env.DB);
    
    // Si BUCKET (R2) está configurado en el entorno de Cloudflare Workers, lo usamos.
    // De lo contrario, cae en el MockStorageRepository para facilidad de desarrollo local.
    const storageRepo = c.env.BUCKET
      ? new R2StorageRepository(c.env.BUCKET)
      : new MockStorageRepository();
    
    return new VerificationService(verificationRepo, storageRepo);
  }

  create = async (c: Context<{ Bindings: Env }>) => {
    const service = VerificationController.getService(c);
    
    // Obtenemos los datos ya validados por el middleware de Zod
    const body = (c.req as any).valid('form') as z.infer<typeof createVerificationSchema>;

    const result = await service.createVerification({
      name: body.name,
      email: body.email,
      documentNumber: body.documentNumber,
      selfie: body.selfie,
      document: body.document,
    });

    return c.json(
      {
        success: true,
        message: 'Verificación iniciada correctamente.',
        data: {
          id: result.id,
          name: result.name,
          email: result.email,
          documentNumber: result.documentNumber,
          status: result.status,
          selfieUrl: result.selfieUrl,
          documentUrl: result.documentUrl,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      },
      201
    );
  };

  get = async (c: Context<{ Bindings: Env }>) => {
    const service = VerificationController.getService(c);
    
    // Obtenemos el ID ya validado
    const { id } = (c.req as any).valid('param') as z.infer<typeof verificationIdSchema>;

    const verification = await service.getVerificationById(id);

    if (!verification) {
      throw new NotFoundError(`No se encontró ninguna solicitud de verificación con el ID: ${id}`);
    }

    return c.json(
      {
        success: true,
        data: verification,
      },
      200
    );
  };
}
