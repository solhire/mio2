import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/messages/submit - Create a new submission with name and message
export async function POST(request: Request) {
  try {
    const { name, message, wallet } = await request.json();

    // Ensure wallet column exists for older databases
    await query('ALTER TABLE submissions ADD COLUMN IF NOT EXISTS wallet TEXT');
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Ensure name is either null or a string
    const sanitizedName = name && typeof name === 'string' ? name.trim() : null;
    const sanitizedWallet = wallet && typeof wallet === 'string' ? wallet.trim() : null;

    // Block specific name or wallet values
    const BLOCKED_NAME = 'MIT';
    const BLOCKED_WALLET = 'BtDAMNtaG7XsVQkfh2sJiCLt7q6tPYVoqGkAh2bEKVam';
    const isBlockedName = !!sanitizedName && sanitizedName.toUpperCase() === BLOCKED_NAME;
    const isBlockedWallet = !!sanitizedWallet && sanitizedWallet === BLOCKED_WALLET;
    if (isBlockedName || isBlockedWallet) {
      return NextResponse.json(
        { error: 'Submission blocked: Invalid name or wallet address.' },
        { status: 400 }
      );
    }
    
    // Insert the submission into the database
    const result = await query(
      'INSERT INTO submissions (name, message, wallet, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [sanitizedName, message.trim(), sanitizedWallet]
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