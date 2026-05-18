import { describe, expect, it } from 'vitest';
import { buildOutputFileName, createUniqueFileNames, stripHeicExtension } from './fileName';

describe('fileName', () => {
  it('HEIC/HEIF拡張子を取り除く', () => {
    expect(stripHeicExtension('photo.heic')).toBe('photo');
    expect(stripHeicExtension('PHOTO.HEIF')).toBe('PHOTO');
  });

  it('出力形式に合わせたファイル名を作る', () => {
    expect(buildOutputFileName('photo.heic', 'jpg')).toBe('photo.jpg');
    expect(buildOutputFileName('photo.heif', 'png')).toBe('photo.png');
    expect(buildOutputFileName('photo.HEIC', 'webp')).toBe('photo.webp');
  });

  it('ZIP内の重複ファイル名に連番を付ける', () => {
    expect(createUniqueFileNames(['photo.jpg', 'photo.jpg', 'photo-1.jpg'])).toEqual([
      'photo.jpg',
      'photo-1.jpg',
      'photo-1-1.jpg',
    ]);
  });
});
