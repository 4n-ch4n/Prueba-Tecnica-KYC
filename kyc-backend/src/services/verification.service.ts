import { VerificationRepository } from '../repositories/verification.repository';
import { StorageRepository } from '../repositories/storage.repository';
import { Verification } from '../types';

export class VerificationService {
  constructor(
    private verificationRepository: VerificationRepository,
    private storageRepository: StorageRepository
  ) {}

  async createVerification(input: {
    name: string;
    email: string;
    documentNumber: string;
    selfie: File;
    document: File;
  }): Promise<Verification> {
    const id = crypto.randomUUID();
    const now = Date.now();

    // Subida de archivos en paralelo a R2/Mock Storage
    const [selfieUrl, documentUrl] = await Promise.all([
      this.storageRepository.uploadFile(input.selfie, 'selfies'),
      this.storageRepository.uploadFile(input.document, 'documents'),
    ]);

    const verification: Verification = {
      id,
      name: input.name,
      email: input.email,
      documentNumber: input.documentNumber,
      status: 'pending',
      selfieUrl,
      documentUrl,
      createdAt: now,
      updatedAt: now,
    };

    await this.verificationRepository.save(verification);
    
    return verification;
  }

  async getVerificationById(id: string): Promise<Verification | null> {
    return this.verificationRepository.findById(id);
  }
}
