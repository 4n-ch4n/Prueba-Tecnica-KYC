import { z } from 'zod';
import { CONFIG } from '../config/constants';

export const createVerificationSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es obligatorio y debe tener al menos 2 caracteres' }).max(100),
  email: z.string().email({ message: 'Formato de email inválido' }),
  documentNumber: z.string().min(3, { message: 'El número de documento debe tener al menos 3 caracteres' }),
  selfie: z.custom<File>((val) => val instanceof File, { message: 'La selfie es obligatoria y debe ser un archivo' })
    .refine((file) => file.size <= CONFIG.MAX_FILE_SIZE, `La selfie no debe superar los ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => CONFIG.ACCEPTED_IMAGE_TYPES.includes(file.type), 'La selfie debe ser PNG, JPG, JPEG o WEBP'),
  document: z.custom<File>((val) => val instanceof File, { message: 'El documento es obligatorio y debe ser un archivo' })
    .refine((file) => file.size <= CONFIG.MAX_FILE_SIZE, `El documento no debe superar los ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => CONFIG.ACCEPTED_IMAGE_TYPES.includes(file.type), 'El documento debe ser PNG, JPG, JPEG o WEBP'),
});

export const verificationIdSchema = z.object({
  id: z.string().uuid({ message: 'El ID de verificación debe ser un UUID válido' }),
});
