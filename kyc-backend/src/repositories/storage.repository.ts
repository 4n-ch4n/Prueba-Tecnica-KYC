export interface StorageRepository {
  uploadFile(file: File, folder: string): Promise<string>;
}

export class MockStorageRepository implements StorageRepository {
  async uploadFile(file: File, folder: string): Promise<string> {
    const fileId = crypto.randomUUID();
    const extension = file.name.split('.').pop() || 'png';
    return `https://storage.kyc-platform.local/${folder}/${fileId}.${extension}`;
  }
}

export class R2StorageRepository implements StorageRepository {
  constructor(private bucket: R2Bucket) {}

  async uploadFile(file: File, folder: string): Promise<string> {
    const fileId = crypto.randomUUID();
    const extension = file.name.split('.').pop() || 'png';
    const key = `${folder}/${fileId}.${extension}`;
    
    await this.bucket.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });
    
    return `https://assets.kyc-platform.local/${key}`;
  }
}
