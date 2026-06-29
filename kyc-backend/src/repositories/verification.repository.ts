import { Verification } from '../types';

export interface VerificationRepository {
  findById(id: string): Promise<Verification | null>;
  save(verification: Verification): Promise<void>;
  updateStatus(id: string, status: Verification['status']): Promise<void>;
}
