import { Pool } from 'pg';

// Initialize the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function for querying the database
export async function query(text: string, params?: Array<string | number | boolean | null>) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Example usage:
// import { query } from '@/lib/db';
// const messages = await query('SELECT * FROM messages LIMIT 10'); 