import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Receive Endpoint
 * Use this for testing without Firebase
 */

const mockData: any = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, location, date, notes } = body;

    if (!items || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const receiveId = `RCV-${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log(`[MOCK API] Receive: ${receiveId}`, { items, location });

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      receiveId,
      timestamp,
      mode: 'mock',
      message: '✅ Mock receive processed (data saved in memory only)'
    });
  } catch (error: any) {
    console.error('[MOCK API] Receive error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process receive' },
      { status: 500 }
    );
  }
}
