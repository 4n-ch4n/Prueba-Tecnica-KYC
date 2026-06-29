import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiClient, ApiError } from '../services/api.client';
import { useKycStore } from '../store/useKycStore';
import type { ApiResponse, Verification } from '../types';

export const useCreateVerification = () => {
  const { setSubmittedVerificationId, setCurrentView } = useKycStore();

  return useMutation<ApiResponse<Verification>, ApiError, FormData>({
    mutationFn: (formData) => ApiClient.createVerification<Verification>(formData),
    onSuccess: (response) => {
      if (response.data?.id) {
        setSubmittedVerificationId(response.data.id);
        setCurrentView('success');
      }
    },
  });
};

export const useGetVerification = (id: string, enabled: boolean) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(id.trim());

  return useQuery<ApiResponse<Verification>, ApiError>({
    queryKey: ['verification', id],
    queryFn: () => ApiClient.getVerification<Verification>(id.trim()),
    enabled: enabled && isUuid,
    retry: (failureCount, error) => {
      // Evitar reintentar si el error es de cliente: 404 (No encontrado) o 400 (Bad Request)
      if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 400)) {
        return false;
      }
      
      // Reintentar un máximo de 2 veces para otros errores (ej: problemas temporales de red)
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};
