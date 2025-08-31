// app/api/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ImageMeta } from '@/interfaces/image';
import { v4 as uuidv4 } from 'uuid';
import { ImagesResponse } from '@/interfaces/api';
import { getToken } from '@auth/core/jwt';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const jsonPath = path.join(process.cwd(), 'data', 'images.json');

export async function GET(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get('tag');
    const page = request.nextUrl.searchParams.get('page');
    const imagesPerPageParam = request.nextUrl.searchParams.get('imagesPerPage');
    const imagesPerPage = imagesPerPageParam !== null ? +imagesPerPageParam : 20;

    const fileContents = await fs.readFile(jsonPath, 'utf8');
    const data: ImageMeta[] = JSON.parse(fileContents);
    let responseImages = data;

    if (tag) {
      responseImages = responseImages.filter((image: ImageMeta) =>
        image.tags.includes(tag)
      );
    }

    const currentPage = page ? parseInt(page, 10) : 1;
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;

    responseImages = responseImages.slice(startIndex, endIndex < responseImages.length ? endIndex : responseImages.length);

    return NextResponse.json({
      images: responseImages,
      page: currentPage,
      totalPages: Math.ceil(responseImages.length / imagesPerPage)
    } as ImagesResponse, { status: 200 });
  } catch (error) {
    console.error('Error reading images data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (token.exp && Date.now() / 1000 > token.exp) {
    return NextResponse.json({ error: 'Token expired' }, { status: 401 });
  }

  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No files received.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      );
    }

    // Generate UUID filename
    const fileExtension = file.name.split('.').pop();
    const uuidFilename = `${uuidv4()}.${fileExtension}`;
    const relativePath = `/${uuidFilename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(imagesDir, uuidFilename);

    // Create images directory if it doesn't exist
    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
    }

    // Create data directory if it doesn't exist
    try {
      await fs.access(path.dirname(jsonPath));
    } catch {
      await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    }

    // Read existing images data or create new
    let imagesData: ImageMeta[] = [];
    try {
      const fileData = await fs.readFile(jsonPath, 'utf8');
      imagesData = JSON.parse(fileData);
    } catch {
      await fs.writeFile(jsonPath, JSON.stringify({ images: [] }, null, 2));
    }

    // Create image metadata
    const imageMeta: ImageMeta = {
      id: uuidv4(),
      relative_path: relativePath,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      gridSize: { rows: 1, cols: 1 }
    };

    // Add new image to data
    imagesData.push(imageMeta);

    // Write image file and update JSON
    await Promise.all([
      fs.writeFile(filePath, buffer),
      fs.writeFile(jsonPath, JSON.stringify(imagesData, null, 2))
    ]);

    return NextResponse.json({
      message: 'File uploaded successfully',
      image: imageMeta
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
