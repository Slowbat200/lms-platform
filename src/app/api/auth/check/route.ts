import { NextResponse } from 'next/server';

export async function GET() {
  // You can add your auth logic here if needed
  return NextResponse.json({ ok: true });
}