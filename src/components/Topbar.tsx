'use client';

import Paginator from '@/components/Paginator';
import Tags from '@/components/Tags';
import { PaginatorPosition } from '@/interfaces/paginator';
import styles from '@/styles/Topbar.module.scss';
import { useEffect, useState } from 'react';

export default function Topbar({
  activeTag,
  tags,
  page,
  totalPages,
}: {
  activeTag: string;
  tags: string[];
  page: number;
  totalPages: number;
}) {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsScrolling(window.scrollY > 0);
    });
  }, []);

  return (
    <div className={`${styles.topbar} ${isScrolling ? styles.topbarScroll : ''}`}>
      <Tags activeTag={activeTag} tags={tags} />
      <Paginator page={page} totalPages={totalPages} position={PaginatorPosition.TOP} />
    </div>
  );
}
