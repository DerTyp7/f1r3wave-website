'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

export async function authenticate(_prevState: string | undefined, formData: FormData): Promise<string> {
  try {
    await signIn('credentials', formData);
    return 'success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid token';
        default:
          return 'Something went wrong';
      }
    }
    throw error;
  }
}

export async function logout() {
  const c = await cookies();

  c.delete('authjs.session-token');
  c.delete('authjs.csrf-token');
  c.delete('authjs.callback-url');
}
