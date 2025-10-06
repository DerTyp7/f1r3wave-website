import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ page: number; tag: string }> }) {
  redirect(`gallery/${(await params).tag}/1`);
}
