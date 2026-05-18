import { z } from 'zod';
import { asHeicFile, type HeicFile } from './types';

const HEIC_EXTENSION_PATTERN = /\.(heic|heif)$/i;
const ACCEPTED_MIME_TYPES = new Set(['', 'image/heic', 'image/heif']);

export interface FileValidationError {
  fileName: string;
  reason: string;
}

export interface HeicFilesValidationResult {
  validFiles: HeicFile[];
  errors: FileValidationError[];
}

export function hasHeicExtension(fileName: string): boolean {
  return HEIC_EXTENSION_PATTERN.test(fileName);
}

export const heicFileSchema = z
  .custom<File>((value) => value instanceof File, {
    message: 'ファイルとして読み込めませんでした。',
  })
  .superRefine((file, context) => {
    if (!hasHeicExtension(file.name)) {
      context.addIssue({
        code: 'custom',
        message: 'HEICまたはHEIFファイルだけを追加できます。',
      });
    }

    if (!ACCEPTED_MIME_TYPES.has(file.type.toLowerCase())) {
      context.addIssue({
        code: 'custom',
        message: 'MIMEタイプがHEIC/HEIFではありません。',
      });
    }
  });

export function validateHeicFile(file: File): HeicFile | FileValidationError {
  const parsed = heicFileSchema.safeParse(file);

  if (parsed.success) {
    return asHeicFile(parsed.data);
  }

  return {
    fileName: file.name || '不明なファイル',
    reason: parsed.error.issues[0]?.message ?? 'ファイルを検証できませんでした。',
  };
}

export function validateHeicFiles(files: Iterable<File>): HeicFilesValidationResult {
  const validFiles: HeicFile[] = [];
  const errors: FileValidationError[] = [];

  for (const file of files) {
    const result = validateHeicFile(file);

    if (result instanceof File) {
      validFiles.push(result);
    } else {
      errors.push(result);
    }
  }

  return { validFiles, errors };
}
