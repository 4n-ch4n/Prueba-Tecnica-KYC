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

export interface CreateVerificationInput {
  name: string;
  email: string;
  documentNumber: string;
  selfie?: File;
  document?: File;
}

export interface Env {
  DB: D1Database;
  BUCKET?: R2Bucket;
}
