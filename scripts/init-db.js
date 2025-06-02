require('dotenv').config({ path: './.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read schema file
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

async function initDb() {
  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Applying schema...');
    await client.query(schema);
    
    console.log('Database initialized successfully!');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
}

initDb(); 