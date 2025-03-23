import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 資料庫配置
const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('PostgreSQL connection established successfully');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default pool; 