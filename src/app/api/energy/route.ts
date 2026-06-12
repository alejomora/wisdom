import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    // Energy is fully managed client-side via Zustand (persisted in localStorage)
    // We just return maxEnergy here. The client handles the actual energy value.
    const MAX_ENERGY = 200;
    return NextResponse.json({ energy: MAX_ENERGY, maxEnergy: MAX_ENERGY });
  } catch (error) {
    console.error('Energy GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
