import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getSession();
  const { password } = await request.json();

  if (password === process.env.ADMIN_TOKEN) {
    session.isAuthenticated = true;
    await session.save();
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
}
