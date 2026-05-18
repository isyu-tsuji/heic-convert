import type { OutputFormat } from './types';

export interface OutputFormatConfig {
  format: OutputFormat;
  label: string;
  extension: string;
  mimeType: string;
  quality?: number;
}

export const OUTPUT_FORMATS = {
  jpg: {
    format: 'jpg',
    label: 'JPG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    quality: 0.92,
  },
  png: {
    format: 'png',
    label: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
  },
  webp: {
    format: 'webp',
    label: 'WebP',
    extension: 'webp',
    mimeType: 'image/webp',
    quality: 0.92,
  },
} as const satisfies Record<OutputFormat, OutputFormatConfig>;

export const OUTPUT_FORMAT_OPTIONS = Object.values(OUTPUT_FORMATS);

export function getOutputFormatConfig(format: OutputFormat): OutputFormatConfig {
  return OUTPUT_FORMATS[format];
}

export function isOutputFormat(value: unknown): value is OutputFormat {
  return typeof value === 'string' && value in OUTPUT_FORMATS;
}
