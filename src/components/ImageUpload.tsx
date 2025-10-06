'use client';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import styles from '@/styles/ImageUpload.module.scss';
import { useState } from 'react';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tags', tags);

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedFile(null);
        setTags('');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Upload Image</h2>

      <span className={styles.message}>{message}</span>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label>Select Image</label>
          <InputField
            name="image"
            type="file"
            accept="image/*"
            onValueChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <InputField
          label="Tags (comma-separated)"
          type="text"
          onValueChange={(e) => setTags(e.target?.value ?? '')}
          placeholder="nature, landscape, sunset"
          disabled={isUploading}
          name={'image'}
        />

        <Button
          label={isUploading ? 'Uploading...' : 'Upload Image'}
          type="submit"
          disabled={!selectedFile || isUploading}
        />
      </form>
    </div>
  );
}
