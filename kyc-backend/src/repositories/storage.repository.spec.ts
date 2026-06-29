import { describe, it, expect, vi } from 'vitest';
import { R2StorageRepository } from './storage.repository';

describe('R2StorageRepository', () => {
  it('debería subir un archivo a R2 y retornar la URL pública', async () => {
    const mockBucket = {
      put: vi.fn().mockResolvedValue({}),
    } as any;

    const repo = new R2StorageRepository(mockBucket);
    const mockFile = new File(['file_content'], 'photo.jpg', { type: 'image/jpeg' });

    const url = await repo.uploadFile(mockFile, 'test-folder');

    expect(mockBucket.put).toHaveBeenCalledTimes(1);
    expect(url).toContain('https://assets.kyc-platform.local/test-folder/');
    expect(url).toContain('.jpg');
  });
});
