import { ImageMeta } from "@/interfaces/image";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  const jsonPath = path.join(process.cwd(), 'data', 'images.json');
  const fileContents = await fs.readFile(jsonPath, 'utf8');
  const data: ImageMeta[] = JSON.parse(fileContents);

  return NextResponse.json(Array.from(new Set(data.flatMap(image => image.tags))));
}