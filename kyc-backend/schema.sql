CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  documentNumber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  selfieUrl TEXT,
  documentUrl TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
