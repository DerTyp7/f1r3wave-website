import { isAuthenticated } from '@/lib/auth-utils';
import { deleteImageById } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated(request))) {
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
