import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/messages/submit - Create a new submission with name and message
export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Ensure name is either null or a string
    const sanitizedName = name && typeof name === 'string' ? name.trim() : null;
    
    // Insert the submission into the database
    const result = await query(
      'INSERT INTO submissions (name, message, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [sanitizedName, message.trim()]
    );
    
    return NextResponse.json({
      submission: result.rows[0],
      success: true
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
} 