import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerificationService } from './verification.service';
import type { VerificationRepository } from '../repositories/verification.repository';
import type { StorageRepository } from '../repositories/storage.repository';

describe('VerificationService', () => {
  let service: VerificationService;
  let mockRepo: VerificationRepository;
  let mockStorage: StorageRepository;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      updateStatus: vi.fn(),
    };

    mockStorage = {
      uploadFile: vi.fn().mockImplementation(async (file, folder) => {
        return `https://storage.local/${folder}/${file.name}`;
      }),
    };

    service = new VerificationService(mockRepo, mockStorage);
  });

  it('debería procesar y guardar la verificación correctamente', async () => {
    const selfieFile = new File(['selfie_data'], 'selfie.png', { type: 'image/png' });
    const docFile = new File(['doc_data'], 'doc.png', { type: 'image/png' });

    const result = await service.createVerification({
      name: 'Juan Pérez',
      email: 'juan@test.com',
      documentNumber: '12345678',
      selfie: selfieFile,
      document: docFile,
    });

    expect(mockStorage.uploadFile).toHaveBeenCalledTimes(2);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Juan Pérez');
    expect(result.status).toBe('pending');
    expect(result.selfieUrl).toBe('https://storage.local/selfies/selfie.png');
    expect(result.documentUrl).toBe('https://storage.local/documents/doc.png');
  });

  it('debería consultar una verificación por id', async () => {
    const mockVerification = {
      id: 'e041ec11-abe6-4161-9be7-f7c954042899',
      name: 'Juan',
      email: 'juan@test.com',
      documentNumber: '12345678',
      status: 'pending' as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    (mockRepo.findById as any).mockResolvedValue(mockVerification);

    const result = await service.getVerificationById('e041ec11-abe6-4161-9be7-f7c954042899');
    expect(mockRepo.findById).toHaveBeenCalledWith('e041ec11-abe6-4161-9be7-f7c954042899');
    expect(result).toEqual(mockVerification);
  });
});
