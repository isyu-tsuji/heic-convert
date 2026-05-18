import { describe, expect, it } from 'vitest';
import { hasHeicExtension, validateHeicFile, validateHeicFiles } from './validation';

describe('validation', () => {
  it('HEIC/HEIF拡張子を判定する', () => {
    expect(hasHeicExtension('photo.heic')).toBe(true);
    expect(hasHeicExtension('photo.HEIF')).toBe(true);
    expect(hasHeicExtension('photo.jpg')).toBe(false);
  });

  it('有効なHEICファイルを受け付ける', () => {
    const file = new File(['dummy'], 'photo.heic', { type: 'image/heic' });

    expect(validateHeicFile(file)).toBe(file);
  });

  it('無効なファイルは理由を返す', () => {
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    const result = validateHeicFile(file);

    expect(result).toEqual({
      fileName: 'photo.jpg',
      reason: 'HEICまたはHEIFファイルだけを追加できます。',
    });
  });

  it('複数ファイルを有効ファイルとエラーに分ける', () => {
    const valid = new File(['dummy'], 'photo.heif', { type: '' });
    const invalid = new File(['dummy'], 'memo.txt', { type: 'text/plain' });

    const result = validateHeicFiles([valid, invalid]);

    expect(result.validFiles).toEqual([valid]);
    expect(result.errors).toHaveLength(1);
  });
});
