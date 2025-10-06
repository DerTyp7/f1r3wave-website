import { validateAdminToken } from '@/lib/auth-utils';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';

export const { auth, signIn } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z.object({ token: z.string().min(1) }).safeParse(credentials);
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
