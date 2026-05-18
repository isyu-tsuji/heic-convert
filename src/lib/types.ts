export type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

export type HeicFile = Brand<File, 'HeicFile'>;
export type ConvertedBlob = Brand<Blob, 'ConvertedBlob'>;
export type OutputFormat = 'jpg' | 'png' | 'webp';
export type ConversionStatus = 'pending' | 'converting' | 'done' | 'failed';

export interface ConversionJob {
  id: string;
  file: HeicFile;
  status: ConversionStatus;
  outputName?: string;
  convertedBlob?: ConvertedBlob;
  error?: string;
}

export interface ConvertedImage {
  sourceName: string;
  outputName: string;
  blob: ConvertedBlob;
}

export function asHeicFile(file: File): HeicFile {
  return file as HeicFile;
}

export function asConvertedBlob(blob: Blob): ConvertedBlob {
  return blob as ConvertedBlob;
}
