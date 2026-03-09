export interface CreativeAsset {
  filePath: string;
  fileName: string;
  type: 'image' | 'video';
  mimeType: string;
  width: number;
  height: number;
  fileSize: number;
  duration: number | null;
  isValid: boolean;
  validationErrors: string[];
}

export interface CreativeBundle {
  format: 'single_image' | 'single_video' | 'carousel';
  assets: CreativeAsset[];
  uploadedIds: Map<string, string>;
}

export type CreativeType = 'image' | 'video';

export const SUPPORTED_MIME_TYPES: Record<string, CreativeType> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/quicktime': 'video',
} as const;

export const SUPPORTED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.mp4',
  '.mov',
] as const;

export const EXTENSION_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
} as const;
