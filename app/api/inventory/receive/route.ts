import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK || '{}'
);

if (!admin.apps.length && Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

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

    // Transaction: Update stock + log movement
    const updates: any = {
      [`movements/${receiveId}`]: {
        id: receiveId,
        type: 'receive',
        location,
        items,
        date: date || new Date().toISOString().split('T')[0],
        notes,
        timestamp,
      },
    };

    // Update stock for each item
    for (const item of items) {
      const { sku, quantity } = item;
      const stockKey = `stock/${location}/${sku}`;

      const snapshot = await db.ref(stockKey).once('value');
      const currentStock = snapshot.val() || 0;

      updates[stockKey] = currentStock + quantity;
    }

    await db.ref().update(updates);

    return NextResponse.json({
      success: true,
      receiveId,
      timestamp
    });
  } catch (error: any) {
    console.error('Receive error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process receive' },
      { status: 500 }
    );
  }
}
