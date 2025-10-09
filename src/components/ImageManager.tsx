/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { ImageMeta } from '@/interfaces/image';
import styles from '@/styles/ImageManager.module.scss';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Tags from './Tags';

export default function ImageManager() {
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [error, setError] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>('all');
  const searchParams = useSearchParams();

  const fetchTags = () => {
    fetch(`/api/tags`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((newTags) => {
        setTags(newTags);
      });
  };

  const fetchImages = () => {
    fetch(`/api/images?imagesPerPage=-1&tag=${activeTag}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((newImages) => {
        if (newImages && newImages.images) {
          setImages(newImages.images);
        }
      });
  };

  const onDelete = (id: string) => {
    fetch(`/api/images/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
        } else {
          fetchTags();
          fetchImages();
        }
      });
  };

  const onSubmitTags = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    fetch(`/api/tags/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.error && response.tags) {
          const indexOfImage = images.findIndex((i) => i.id === id);

          if (indexOfImage !== -1) {
            const newImages = [...images];

            newImages[indexOfImage] = {
              ...newImages[indexOfImage],
              tags: response.allTags,
            };

            setImages(newImages);

            fetchTags();
          }
        } else if (response.error) {
          setError(response.error);
        }
      });
  };

  useEffect(() => {
    fetchTags();
    fetchImages();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [activeTag]);

  useEffect(() => {
    setActiveTag(searchParams.get('tag') ?? 'all');
  }, [searchParams, tags]);

  return (
    <div className={styles.container}>
      <h2>Manage Images</h2>
      <span className={styles.error}>{error}</span>
      <Tags tags={tags} activeTag={activeTag} redirectUrlWithPlaceholder="admin?tag=${tag}" />
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}>
                <td>
                  <Image src={`/api/images/${image.id}`} height={50} width={50} alt={image.id} />
                </td>
                <td>{image.id}</td>
                <td>
                  <form className={styles.tagForm} onSubmit={(e) => onSubmitTags(image.id, e)}>
                    <InputField
                      name="tags"
                      placeholder="Nature, Landscape, Sunset"
                      defaultValue={image.tags?.join(', ') || ''}
                    />
                    <Button label="Save" type="submit" />
                  </form>
                </td>
                <td>
                  <Button label="Delete" onClickCallback={() => onDelete(image.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
