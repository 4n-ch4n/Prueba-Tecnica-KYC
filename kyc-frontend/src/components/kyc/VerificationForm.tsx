import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { useCreateVerification } from '../../hooks/useVerification';
import Input from '../ui/Input';
import Button from '../ui/Button';
import DragDropUpload from '../ui/DragDropUpload';
import Alert from '../ui/Alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const verificationFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'El nombre es obligatorio y debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre no debe superar los 100 caracteres' }),
  email: z.string()
    .email({ message: 'Ingresa una dirección de correo válida' }),
  documentNumber: z.string()
    .min(3, { message: 'El número de documento debe tener al menos 3 caracteres' }),
  selfie: z.custom<File>((val) => val instanceof File, { message: 'La foto selfie es obligatoria' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'La selfie no debe superar los 5MB')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Formato inválido. Usa PNG, JPG, JPEG o WEBP'),
  document: z.custom<File>((val) => val instanceof File, { message: 'La imagen del documento es obligatoria' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'El documento no debe superar los 5MB')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Formato inválido. Usa PNG, JPG, JPEG o WEBP'),
});

type VerificationFormValues = z.infer<typeof verificationFormSchema>;

export const VerificationForm: React.FC = () => {
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  const mutation = useCreateVerification();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      documentNumber: '',
      selfie: null as any,
      document: null as any,
    },
  });

  const onSubmit = (data: VerificationFormValues) => {
    setGlobalError(null);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('documentNumber', data.documentNumber);
    formData.append('selfie', data.selfie);
    formData.append('document', data.document);

    mutation.mutate(formData, {
      onError: (err) => {
        if (err.errors && err.errors.length > 0) {
          err.errors.forEach((valErr) => {
            setError(valErr.field as any, {
              type: 'server',
              message: valErr.message,
            });
          });
        } else {
          setGlobalError(err.message);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary-500" />
          Registrar Verificación KYC
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Por favor, completa los campos y sube las imágenes solicitadas para iniciar tu proceso.
        </p>
      </div>

      {globalError && (
        <Alert type="error" title="Error de envío" message={globalError} />
      )}

      <div className="space-y-4">
        <Input
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          icon={<User className="w-5 h-5" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="Ej. juan@test.com"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Número de Documento"
          placeholder="Ej. 12345678"
          icon={<FileText className="w-5 h-5" />}
          error={errors.documentNumber?.message}
          {...register('documentNumber')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Controller
          name="selfie"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DragDropUpload
              label="Foto de Selfie"
              description="Sube una foto clara de tu rostro frente a la cámara"
              error={errors.selfie?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="document"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DragDropUpload
              label="Foto del Documento"
              description="Sube una foto legible de tu identificación (DNI/Pasaporte)"
              error={errors.document?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        className="w-full justify-center mt-4"
        isLoading={mutation.isPending}
      >
        Enviar Solicitud de Verificación
      </Button>
    </form>
  );
};
export default VerificationForm;
