'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(_prevState: string | undefined, formData: FormData): Promise<string> {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      token: formData.get('token'),
    });

    if (result?.error) {
      return 'Invalid token';
    }

    redirect('/admin');
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

export async function performLogout() {
  await signOut({ redirectTo: '/', redirect: true });
  redirect('/');
}
