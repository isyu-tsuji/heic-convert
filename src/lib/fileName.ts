import { getOutputFormatConfig } from './outputFormat';
import type { OutputFormat } from './types';

const HEIC_EXTENSION_PATTERN = /\.(heic|heif)$/i;

export function stripHeicExtension(fileName: string): string {
  const stripped = fileName.replace(HEIC_EXTENSION_PATTERN, '').trim();
  return stripped || 'converted-image';
}

export function buildOutputFileName(inputName: string, format: OutputFormat): string {
  const { extension } = getOutputFormatConfig(format);
  return `${stripHeicExtension(inputName)}.${extension}`;
}

export function createUniqueFileNames(fileNames: string[]): string[] {
  const usedNames = new Set<string>();

  return fileNames.map((fileName) => {
    const { baseName, extension } = splitFileName(fileName);
    let candidate = fileName;
    let index = 1;

    while (usedNames.has(candidate.toLowerCase())) {
      candidate = `${baseName}-${index}${extension}`;
      index += 1;
    }

    usedNames.add(candidate.toLowerCase());
    return candidate;
  });
}

function splitFileName(fileName: string): { baseName: string; extension: string } {
  const match = /^(.*?)(\.[^.]+)?$/.exec(fileName);
  const baseName = match?.[1] || 'converted-image';
  const extension = match?.[2] || '';

  return { baseName, extension };
}
