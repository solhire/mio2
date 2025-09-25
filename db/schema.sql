-- Schema for MIO application

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  message TEXT NOT NULL,
  wallet TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Add some initial sample data (comment out if not needed)
INSERT INTO submissions (name, message, created_at) VALUES 
  ('Grace', 'Still breathing.', NOW() - INTERVAL '30 minutes'),
  (NULL, 'Because I''ve been stuck for too long.', NOW() - INTERVAL '20 minutes'),
  ('Alex', 'I want to make it out for my little sister.', NOW() - INTERVAL '10 minutes');

-- For backward compatibility (can be removed later)
-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Add some initial sample data (comment out if not needed)
INSERT INTO messages (text, created_at) VALUES 
  ('I want to make it out for my little sister.', NOW() - INTERVAL '30 minutes'),
  ('Because I''ve been stuck for too long.', NOW() - INTERVAL '20 minutes'),
  ('Still breathing.', NOW() - INTERVAL '10 minutes'); 