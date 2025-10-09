'use client';

import { ImageMeta } from '@/interfaces/image';
import styles from '@/styles/Gallery.module.scss';
import Image from 'next/image';
import { useRouter as useNavigationRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GalleryProps {
  initialImages: ImageMeta[];
}

export default function Gallery({ initialImages }: GalleryProps) {
  const HORIZONTAL_ASPECT_RATIO = 1.5;
  const VERTICAL_ASPECT_RATIO = 0.9;

  const navigationRouter = useNavigationRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [columnCount, setColumnCount] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    const updateColumns = () => {
      const newImages = [...initialImages];

      if (newImages.length > 0) {
        let usedColumnsInRow = 0;
        let usedRowsInColumn = 0;
        let index = 0;

        for (const image of newImages) {
          usedColumnsInRow += image.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
          usedRowsInColumn += image.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;

          if (usedColumnsInRow > columnCount) {
            const nextViableImage: ImageMeta | undefined = newImages.slice(index).find((img) => {
              const imgAspectRatio = img.aspect_ratio;
              return imgAspectRatio <= HORIZONTAL_ASPECT_RATIO && image.aspect_ratio >= VERTICAL_ASPECT_RATIO;
            });

            if (nextViableImage) {
              newImages.splice(index, 1);
              newImages.splice(index - 1, 0, nextViableImage);

              usedColumnsInRow -= nextViableImage.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
              usedRowsInColumn -= nextViableImage.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;
            }
          } else if (usedColumnsInRow === columnCount) {
            usedColumnsInRow = usedRowsInColumn;
            usedRowsInColumn = 0;
          }

          index++;
        }

        setImages(newImages);
      }
    };

    const updateColumnCount = () => {
      const container = document.querySelector(`.${styles.images}`);
      if (!container) return;

      const newColumnCount = window
        .getComputedStyle(container)
        .getPropertyValue('grid-template-columns')
        .split(' ').length;

      if (newColumnCount !== columnCount) {
        setColumnCount(newColumnCount);
      }
    };

    setImages([...initialImages]);
    updateColumns();
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [columnCount, initialImages]);

  useEffect(() => {
    const imagePath = searchParams.get('image');

    if (imagePath) {
      setFullScreenImage(`/images/${imagePath}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (fullScreenImage) {
      const params = new URLSearchParams(searchParams.toString());
      const relativePath = fullScreenImage.replace('/images/', '');
      params.set('image', relativePath);
      navigationRouter.replace(`?${params.toString()}`, { scroll: false });

      document.body.style.overflow = 'hidden';
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('image');
      navigationRouter.replace(`?${params.toString()}`, { scroll: false });

      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreenImage, searchParams, navigationRouter]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    navigationRouter.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, navigationRouter]);

  return (
    <div className={styles.gallery}>
      <div className={styles.images}>
        {images.map((image: ImageMeta) => (
          <div
            key={uuidv4()}
            className={`${styles.imagesContainer} ${
              image.aspect_ratio > HORIZONTAL_ASPECT_RATIO
                ? styles.horizontal
                : image.aspect_ratio < VERTICAL_ASPECT_RATIO
                  ? styles.vertical
                  : ''
            }`}>
            <Image
              width={image.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? image.width : 700}
              height={image.aspect_ratio < VERTICAL_ASPECT_RATIO ? image.height : 700}
              loading="lazy"
              src={`/api/images/${image.id}`}
              alt={image.aspect_ratio?.toString()}
              onClick={() => setFullScreenImage(`/images/${image.relative_path}`)}
            />
          </div>
        ))}
      </div>

      {fullScreenImage && (
        <div className={styles.fullscreenModal} onClick={() => setFullScreenImage(null)}>
          <Image
            src={fullScreenImage}
            alt="Full Screen"
            width={1920}
            height={1080}
            style={{ objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}>
            &times;
          </button>

          <button
            className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex((image) => `/images/${image.relative_path}` === fullScreenImage);
              if (currentIndex > 0) {
                setFullScreenImage(`/images/${images[currentIndex - 1].relative_path}`);
              }
            }}>
            &#8249;
          </button>

          <button
            className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex((image) => `/images/${image.relative_path}` === fullScreenImage);
              if (currentIndex < images.length - 1) {
                setFullScreenImage(`/images/${images[currentIndex + 1].relative_path}`);
              }
            }}>
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
