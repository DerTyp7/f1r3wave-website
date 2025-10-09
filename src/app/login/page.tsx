import LoginForm from '@/components/LoginForm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect('/admin');
  }

  return <LoginForm />;
}
