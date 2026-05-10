import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Issue Endpoint
 * Use this for testing without Firebase
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, fromLocation, toLocation, customerId, type, notes } = body;

    if (!items || !fromLocation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const issueId = `ISS-${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log(`[MOCK API] Issue: ${issueId}`, { items, fromLocation, toLocation, customerId });

    // Simulate validation and processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock stock check
    for (const item of items) {
      if (item.quantity > 100) {
        return NextResponse.json(
          { error: `Quantity too high for ${item.sku}. Demo max: 100 units` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      issueId,
      timestamp,
      mode: 'mock',
      message: '✅ Mock issue processed (data saved in memory only)'
    });
  } catch (error: any) {
    console.error('[MOCK API] Issue error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process issue' },
      { status: 500 }
    );
  }
}
