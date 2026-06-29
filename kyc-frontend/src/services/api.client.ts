import { API_URL } from '../config';
import type { ApiResponse, ValidationErrorDetail } from '../types';

export class ApiError extends Error {
  statusCode: number;
  errors?: ValidationErrorDetail[] | null;

  constructor(
    message: string,
    statusCode: number,
    errors?: ValidationErrorDetail[] | null
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class ApiClient {
  private static baseUrl = API_URL;

  static async createVerification<T>(formData: FormData): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}/verification`, {
      method: 'POST',
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  static async getVerification<T>(id: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}/verification/${id}`);
    return this.handleResponse<T>(response);
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let result: ApiResponse<T>;
    
    try {
      result = await response.json();
    } catch (err) {
      throw new ApiError('Error al decodificar la respuesta del servidor.', response.status);
    }

    if (!response.ok || !result.success) {
      throw new ApiError(
        result.message || 'Ocurrió un error en el servidor.',
        response.status,
        result.errors
      );
    }

    return result;
  }
}
