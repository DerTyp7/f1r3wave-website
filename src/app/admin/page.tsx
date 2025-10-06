import ImageManager from '@/components/ImageManager';
import ImageUpload from '@/components/ImageUpload';
import { ImagesResponse, TagsResponse } from '@/interfaces/api';
import { getAuthStatus } from '@/lib/auth-utils';
import styles from '@/styles/AdminPage.module.scss';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const { isAuthenticated } = await getAuthStatus();

  if (!isAuthenticated) {
    redirect('/login');
  }

  const fetchImages = async () => {
    const apiUrl = new URL(
      '/api/images?imagesPerPage=-1}',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    );
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return (await response.json()) as ImagesResponse;
  };

  const fetchTags = async () => {
    const apiUrl = new URL('/api/tags', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return (await response.json()) as TagsResponse;
  };

  return (
    <div className={styles.container}>
      <ImageUpload />
      <ImageManager tags={await fetchTags()} images={(await fetchImages()).images} />
    </div>
  );
}
