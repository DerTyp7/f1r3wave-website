import { imagesDir, jsonPath } from '@/const/api';
import { ImageMeta } from '@/interfaces/image';
import fs from 'fs/promises';
import path from 'path';

async function ensureDataDirectoryExists(): Promise<void> {
  try {
    await fs.access(path.dirname(jsonPath));
  } catch {
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
  }
}

export async function getImageData(): Promise<ImageMeta[]> {
  await ensureDataDirectoryExists();

  try {
    const data = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(data);
  } catch {
    await updateImageData([]);
    return [];
  }
}

export function stringToTags(string: string): string[] {
  return string
    ? string
        .split(',')
        .map((tag) => tag.trim())
        .filter((t) => t !== 'All' && t.length > 0)
    : [];
}
export async function updateTagsOfImageId(id: string, tags: string[]): Promise<number> {
  const imagesData: ImageMeta[] = await getImageData();

  const indexOfImage = imagesData.findIndex((i) => i.id === id);
  if (indexOfImage === -1) {
    return -1;
  }

  imagesData[indexOfImage].tags = tags;
  updateImageData(imagesData);

  return 0;
}

export async function deleteImageById(id: string): Promise<number> {
  const imagesData: ImageMeta[] = await getImageData();

  try {
    const imagePath = imagesData.find((i) => i.id === id)?.relative_path;
    if (imagePath) {
      fs.rm(path.join(imagesDir, imagePath));
      await updateImageData(imagesData.filter((i) => i.id !== id));
      return 0;
    }
  } catch (e) {
    console.log('Could not delete image', e);
  }

  return -1;
}

export async function addImage(newImage: ImageMeta): Promise<void> {
  updateImageData([newImage].concat(await getImageData()));
}

async function updateImageData(newData: ImageMeta[]): Promise<void> {
  await ensureDataDirectoryExists();
  await fs.writeFile(jsonPath, JSON.stringify(newData, null, 2));
}
