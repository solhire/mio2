import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Cache the count for 15 seconds to reduce database load
let cachedCount: number | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 15000; // 15 seconds

export async function GET() {
  try {
    const currentTime = Date.now();
    
    // Return cached count if it's still valid
    if (cachedCount !== null && currentTime - lastFetchTime < CACHE_TTL) {
      return NextResponse.json({ count: cachedCount });
    }
    
    // Query both tables and sum the counts
    const submissionsResult = await query('SELECT COUNT(*) as count FROM submissions');
    const messagesResult = await query('SELECT COUNT(*) as count FROM messages');
    
    const submissionsCount = parseInt(submissionsResult.rows[0].count) || 0;
    const messagesCount = parseInt(messagesResult.rows[0].count) || 0;
    
    // Calculate total count
    const totalCount = submissionsCount + messagesCount;
    
    // Update cache
    cachedCount = totalCount;
    lastFetchTime = currentTime;
    
    return NextResponse.json({ count: totalCount });
  } catch (error) {
    console.error('Error fetching submission count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission count', count: 0 },
      { status: 500 }
    );
  }
} 