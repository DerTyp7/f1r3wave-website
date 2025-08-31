'use server';

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