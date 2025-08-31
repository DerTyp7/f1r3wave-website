'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  try {
    await signIn('credentials', formData);
    return 'success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid token.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}