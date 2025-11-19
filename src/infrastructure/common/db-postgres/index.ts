// src/infrastructure/db/index.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error(' Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});
