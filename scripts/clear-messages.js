// Script to clear all messages from the database
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Create a connection to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // For Neon database connections
  }
});

async function clearMessages() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Delete all messages from the submissions table
    const submissionsResult = await client.query('DELETE FROM submissions');
    console.log(`Deleted ${submissionsResult.rowCount} rows from submissions table`);
    
    // Delete all messages from the messages table (if it exists and is still used)
    const messagesResult = await client.query('DELETE FROM messages');
    console.log(`Deleted ${messagesResult.rowCount} rows from messages table`);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('All messages have been cleared successfully');
  } catch (err) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error clearing messages:', err);
  } finally {
    // Release the client
    client.release();
    // Close the pool
    pool.end();
  }
}

// Run the function
clearMessages(); 