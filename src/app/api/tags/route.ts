import { ImageMeta } from '@/interfaces/image';
import { getImageData } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  const data: ImageMeta[] = await getImageData();
  return NextResponse.json(Array.from(new Set(data.flatMap((image) => image.tags))));
}
