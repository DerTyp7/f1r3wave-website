import LoginForm from '@/components/LoginForm';
import { getAuthStatus } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { isAuthenticated } = await getAuthStatus();

  if (isAuthenticated) {
    redirect('/admin');
  }

  return <LoginForm />;
}
