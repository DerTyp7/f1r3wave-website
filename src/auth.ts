import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { validateAdminToken } from '@/lib/auth-utils';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ token: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { token } = parsedCredentials.data;

          const isValidToken = await validateAdminToken(token);

          if (isValidToken) {
            return {
              id: 'admin-id',
              name: 'Administrator',
              role: 'admin',
            };
          }
        }

        return null;
      },
    }),
  ],
});