import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './index';

describe('Endpoints de Verificación KYC', () => {
  let mockD1: any;

  beforeEach(() => {
    mockD1 = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      first: vi.fn(),
      run: vi.fn(),
    };
  });

  it('GET / debería responder con estado de salud del Edge', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.message).toContain('Plataforma Mini KYC API');
  });

  it('GET /verification/:id debería retornar 404 si el registro no existe', async () => {
    mockD1.first.mockResolvedValue(null);
    const res = await app.request('/verification/e041ec11-abe6-4161-9be7-f7c954042899', {}, {
      DB: mockD1,
    });

    expect(res.status).toBe(404);
    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
    expect(json.message).toContain('No se encontró ninguna solicitud');
  });

  it('GET /verification/:id debería retornar 400 si el formato del ID no es UUID', async () => {
    const res = await app.request('/verification/not-a-valid-uuid', {}, {
      DB: mockD1,
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
    expect(json.message).toContain('Error de validación');
  });

  it('GET /verification/:id debería retornar 200 si el registro existe', async () => {
    const mockRecord = {
      id: 'e041ec11-abe6-4161-9be7-f7c954042899',
      name: 'Juan',
      email: 'juan@test.com',
      documentNumber: '12345678',
      status: 'pending',
      selfieUrl: 'https://storage.local/selfie.jpg',
      documentUrl: 'https://storage.local/doc.png',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    mockD1.first.mockResolvedValue(mockRecord);

    const res = await app.request('/verification/e041ec11-abe6-4161-9be7-f7c954042899', {}, {
      DB: mockD1,
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Juan');
  });

  it('POST /verification debería retornar 400 por payload de validación fallido', async () => {
    const formData = new FormData();
    formData.append('name', 'J'); // Inválido

    const res = await app.request('/verification', {
      method: 'POST',
      body: formData,
    }, {
      DB: mockD1,
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
  });

  it('POST /verification debería registrar exitosamente si los datos son correctos', async () => {
    const selfieFile = new File(['selfie'], 'selfie.jpg', { type: 'image/jpeg' });
    const docFile = new File(['doc'], 'document.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('name', 'Juan');
    formData.append('email', 'juan@test.com');
    formData.append('documentNumber', '12345678');
    formData.append('selfie', selfieFile);
    formData.append('document', docFile);

    mockD1.run.mockResolvedValue({ success: true });

    const res = await app.request('/verification', {
      method: 'POST',
      body: formData,
    }, {
      DB: mockD1,
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.id).toBeDefined();
    expect(json.data.status).toBe('pending');
  });
});
