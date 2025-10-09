import { stringToTags, updateTagsOfImageId } from '@/lib/data';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, context: { params: Promise<{ imageId: string }> }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { imageId } = await context.params;
  const formData = await request.formData();
  const tags = stringToTags(formData.get('tags')?.toString() ?? '');

  const status = await updateTagsOfImageId(imageId, tags ?? []);

  if (status === 0) {
    return NextResponse.json({ message: 'Tags updated successfully', tags: tags }, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
