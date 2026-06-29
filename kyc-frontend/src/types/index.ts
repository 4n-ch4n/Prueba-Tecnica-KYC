export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Verification {
  id: string;
  name: string;
  email: string;
  documentNumber: string;
  status: VerificationStatus;
  selfieUrl?: string | null;
  documentUrl?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationErrorDetail[] | null;
  timestamp?: string;
}
