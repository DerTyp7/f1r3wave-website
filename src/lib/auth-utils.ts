'use server';

import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function validateAdminToken(token: string): Promise<boolean> {
  return token === process.env.ADMIN_TOKEN;
}

export async function getAuthStatus() {
  const { auth } = await import('@/auth');
  const session = await auth();

  return {
    isAuthenticated: !!session?.user,
    user: session?.user,
  };
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  console.log('isAuthenticated');
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  console.log('token', token);
  if (!token || (token.exp && Date.now() / 1000 > token.exp)) {
    console.log('false');
    return false;
  }
  console.log('true');
  return true;
}
