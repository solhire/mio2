import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/messages - Fetch recent messages from submissions table
export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, message, wallet, created_at FROM submissions ORDER BY created_at DESC LIMIT 50'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message
export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }
    
    // Insert the message into the database
    const result = await query(
      'INSERT INTO messages (text, created_at) VALUES ($1, NOW()) RETURNING *',
      [text.trim()]
    );
    
    return NextResponse.json({
      message: result.rows[0],
      success: true
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
} 