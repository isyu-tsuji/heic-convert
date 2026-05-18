import JSZip from 'jszip';
import { createUniqueFileNames } from './fileName';
import type { ConvertedBlob, ConvertedImage } from './types';

export const ZIP_FILE_NAME = 'converted-images.zip';

export interface ZipEntry {
  fileName: string;
  blob: ConvertedBlob;
}

export function createZipEntries(images: ConvertedImage[]): ZipEntry[] {
  const uniqueNames = createUniqueFileNames(images.map((image) => image.outputName));

  return images.map((image, index) => ({
    fileName: uniqueNames[index],
    blob: image.blob,
  }));
}

export async function createConvertedImagesZip(images: ConvertedImage[]): Promise<Blob> {
  const zip = new JSZip();

  for (const entry of createZipEntries(images)) {
    zip.file(entry.fileName, entry.blob);
  }

  return zip.generateAsync({ type: 'blob' });
}
