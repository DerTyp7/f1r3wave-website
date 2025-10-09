import { configPath, configTemplate } from '@/const/api';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fileBuffer = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(fileBuffer);
    return NextResponse.json(config, { status: 200 });
  } catch {
    await fs.writeFile(configPath, JSON.stringify(configTemplate, null, 2));
    return NextResponse.json(configTemplate, { status: 201 });
  }
}
