import { imagesDir } from '@/const/api';
import { deleteImageById, getImageDataById } from '@/lib/data';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const imageData = await getImageDataById(id);

    if (!imageData) {
      return NextResponse.json({ error: 'Image not found in data' }, { status: 404 });
    }

    const filePath = path.join(imagesDir, imageData.relative_path);

    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageBuffer = await fs.readFile(filePath);

    const ext = path.extname(id).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${imageData.relative_path}"`);

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      statusText: 'OK',
      headers,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const status = await deleteImageById(id);

  if (status === 0) {
    return NextResponse.json({ message: 'File deleted successfully' }, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
