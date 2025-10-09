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
  const HORIZONTAL_ASPECT_RATIO = 1.7;
  const VERTICAL_ASPECT_RATIO = 0.8;

  const navigationRouter = useNavigationRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [columnCount, setColumnCount] = useState(0);
  const [fullScreenImageId, setFullScreenImageId] = useState<string | null>(null);

  useEffect(() => {
    const updateColumns = () => {
      const imageStack = [...initialImages];
      const newImages: ImageMeta[] = [];

      if (imageStack.length > 0) {
        let usedColumnsInRow = 0;
        let usedRowsInColumn = 0;
        let index = 0;

        for (const image of imageStack) {
          console.log('image', image.id);
          usedColumnsInRow += image.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
          usedRowsInColumn += image.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;

          if (usedColumnsInRow > columnCount) {
            const nextViableImage: ImageMeta | undefined = imageStack.slice(index).find((img) => {
              const imgAspectRatio = img.aspect_ratio;
              return (
                imgAspectRatio <= HORIZONTAL_ASPECT_RATIO &&
                image.aspect_ratio >= VERTICAL_ASPECT_RATIO &&
                !newImages.find((i) => i.id === img.id)
              );
            });

            if (nextViableImage) {
              newImages.push(nextViableImage);

              usedColumnsInRow -= nextViableImage.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
              usedRowsInColumn -= nextViableImage.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;
            }
          } else if (usedColumnsInRow === columnCount) {
            newImages.push(image);
            usedColumnsInRow = usedRowsInColumn;
            usedRowsInColumn = 0;
          }
          index++;
        }
        console.log('new images', imageStack);
        setImages(imageStack);
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

    updateColumns();
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [columnCount, initialImages]);

  useEffect(() => {
    const imageId = searchParams.get('image');
    setFullScreenImageId(imageId);
  }, [searchParams]);

  useEffect(() => {
    if (fullScreenImageId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('image', fullScreenImageId);
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
  }, [fullScreenImageId, searchParams, navigationRouter]);

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
              onClick={() => setFullScreenImageId(image.id)}
            />
          </div>
        ))}
      </div>

      {fullScreenImageId && (
        <div className={styles.fullscreenModal} onClick={() => setFullScreenImageId(null)}>
          <Image
            src={`/api/images/${fullScreenImageId}`}
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
              setFullScreenImageId(null);
            }}>
            &times;
          </button>

          <button
            className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex((image) => image.id === fullScreenImageId);
              if (currentIndex > 0) {
                setFullScreenImageId(images[currentIndex - 1].id);
              }
            }}>
            &#8249;
          </button>

          <button
            className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex((image) => image.id === fullScreenImageId);
              if (currentIndex < images.length - 1) {
                setFullScreenImageId(images[currentIndex + 1].id);
              }
            }}>
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
