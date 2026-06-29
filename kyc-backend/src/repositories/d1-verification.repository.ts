import { Verification } from '../types';
import { VerificationRepository } from './verification.repository';

export class D1VerificationRepository implements VerificationRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Verification | null> {
    const result = await this.db
      .prepare('SELECT * FROM verifications WHERE id = ?')
      .bind(id)
      .first<Record<string, any>>();

    if (!result) {
      return null;
    }

    return {
      id: result.id as string,
      name: result.name as string,
      email: result.email as string,
      documentNumber: result.documentNumber as string,
      status: result.status as Verification['status'],
      selfieUrl: result.selfieUrl as string | null,
      documentUrl: result.documentUrl as string | null,
      createdAt: Number(result.createdAt),
      updatedAt: Number(result.updatedAt),
    };
  }

  async save(verification: Verification): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO verifications (id, name, email, documentNumber, status, selfieUrl, documentUrl, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        verification.id,
        verification.name,
        verification.email,
        verification.documentNumber,
        verification.status,
        verification.selfieUrl || null,
        verification.documentUrl || null,
        verification.createdAt,
        verification.updatedAt
      )
      .run();
  }

  async updateStatus(id: string, status: Verification['status']): Promise<void> {
    await this.db
      .prepare('UPDATE verifications SET status = ?, updatedAt = ? WHERE id = ?')
      .bind(status, Date.now(), id)
      .run();
  }
}
