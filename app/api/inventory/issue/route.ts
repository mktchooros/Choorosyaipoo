import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

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
    const { items, fromLocation, toLocation, customerId, type, notes } = body;

    if (!items || !fromLocation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const issueId = `ISS-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Check stock availability first
    for (const item of items) {
      const { sku, quantity } = item;
      const stockKey = `stock/${fromLocation}/${sku}`;
      const snapshot = await db.ref(stockKey).once('value');
      const currentStock = snapshot.val() || 0;

      if (currentStock < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for SKU ${sku}. Available: ${currentStock}` },
          { status: 400 }
        );
      }
    }

    const updates: any = {
      [`movements/${issueId}`]: {
        id: issueId,
        type: type || 'issue', // 'issue' | 'transfer'
        fromLocation,
        toLocation: toLocation || null,
        customerId: customerId || null,
        items,
        notes,
        timestamp,
      },
    };

    // Update stock
    for (const item of items) {
      const { sku, quantity } = item;

      // Decrease from location
      const fromStockKey = `stock/${fromLocation}/${sku}`;
      const snapshot = await db.ref(fromStockKey).once('value');
      const currentStock = snapshot.val() || 0;
      updates[fromStockKey] = currentStock - quantity;

      // Increase to location if transfer
      if (toLocation) {
        const toStockKey = `stock/${toLocation}/${sku}`;
        const toSnapshot = await db.ref(toStockKey).once('value');
        const toStock = toSnapshot.val() || 0;
        updates[toStockKey] = toStock + quantity;
      }
    }

    await db.ref().update(updates);

    return NextResponse.json({
      success: true,
      issueId,
      timestamp
    });
  } catch (error: any) {
    console.error('Issue error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process issue' },
      { status: 500 }
    );
  }
}
