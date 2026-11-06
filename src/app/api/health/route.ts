import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    engine: 'Flame in Microgravity SI Engine',
    time: new Date().toISOString(),
  });
}
