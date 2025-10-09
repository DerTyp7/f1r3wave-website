import ImageManager from '@/components/ImageManager';
import ImageUpload from '@/components/ImageUpload';
import { getSession } from '@/lib/session';
import styles from '@/styles/AdminPage.module.scss';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <ImageUpload />
      <ImageManager />
    </div>
  );
}
