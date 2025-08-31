import { ImageMeta } from "@/interfaces/image";

export interface ImagesResponse {
  images: ImageMeta[];
  page: number;
  totalPages: number;
}