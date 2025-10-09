'use server';

import { cookies } from 'next/headers';

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
