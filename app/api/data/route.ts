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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';

    const snapshot = await db.ref(path).once('value');
    const data = snapshot.val();

    return NextResponse.json({
      success: true,
      path,
      data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, data } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    await db.ref(path).set(data);

    return NextResponse.json({
      success: true,
      path,
      message: 'Data saved successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, data } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    await db.ref(path).update(data);

    return NextResponse.json({
      success: true,
      path,
      message: 'Data updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
