import { imagesDir } from '@/const/api';
import { ImagesResponse } from '@/interfaces/api';
import { ImageMeta } from '@/interfaces/image';
import { addImage, getImageData, stringToTags } from '@/lib/data';
import { getSession } from '@/lib/session';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get('tag');
    const page = request.nextUrl.searchParams.get('page');
    const imagesPerPageParam = request.nextUrl.searchParams.get('imagesPerPage');

    let imagesPerPage = imagesPerPageParam !== null ? +imagesPerPageParam : 20;

    const images: ImageMeta[] = await getImageData();
    let responseImages = images;

    if (tag && tag.toLowerCase() !== 'all') {
      responseImages = responseImages.filter((image: ImageMeta) => image.tags.includes(tag));
    }

    if (imagesPerPage === -1) {
      imagesPerPage = responseImages.length;
    }

    const currentPage = page ? parseInt(page, 10) : 1;
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;

    const totalPages = Math.ceil(responseImages.length / imagesPerPage);
    responseImages = responseImages.slice(
      startIndex,
      endIndex < responseImages.length ? endIndex : responseImages.length,
    );

    return NextResponse.json(
      {
        images: responseImages,
        page: currentPage,
        totalPages: totalPages,
      } as ImagesResponse,
      { status: 200 },
    );
  } catch (error) {
    console.error('Error reading images data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const uuid = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const uuidFilename = `${uuid}.${fileExtension}`;
    const relativePath = `${uuidFilename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
    }

    await fs.writeFile(path.join(imagesDir, uuidFilename), buffer);

    const imageInfo = await sharp(buffer).metadata();

    const newImage: ImageMeta = {
      id: uuid,
      relative_path: relativePath,
      tags: stringToTags(tags),
      aspect_ratio: imageInfo.width && imageInfo.height ? imageInfo.width / imageInfo.height : 1,
      width: imageInfo.width || 0,
      height: imageInfo.height || 0,
    };

    await addImage(newImage);
    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
