import Gallery from '@/components/Gallery';
import Paginator from '@/components/Paginator';
import Topbar from '@/components/Topbar';
import { ImagesResponse, TagsResponse } from '@/interfaces/api';
import { PaginatorPosition } from '@/interfaces/paginator';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function GalleryPage({ params }: { params: Promise<{ page: number; tag: string }> }) {
  const { tag, page } = await params;

  const fetchImages = async () => {
    const apiUrl = new URL(
      `/api/images?page=${page}&tag=${tag === 'all' ? '' : tag}`,
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

  const images = await fetchImages();
  const tags = await fetchTags();

  if (images.totalPages < page && images.totalPages > 0) {
    redirect(`/gallery/${tag}/${images.totalPages}`);
  }

  if (page <= 0) {
    redirect(`/gallery/${tag}/1`);
  }

  return (
    <>
      <Suspense fallback={<div>Loading gallery...</div>}>
        <Topbar activeTag={tag} tags={tags} page={page} totalPages={images.totalPages} />
        <Gallery initialImages={images.images} />
        <Paginator page={page} totalPages={images.totalPages} position={PaginatorPosition.BOTTOM} />
      </Suspense>
    </>
  );
}
