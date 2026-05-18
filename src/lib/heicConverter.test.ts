import { describe, expect, it } from 'vitest';
import {
  decodeHeicToImageData,
  encodeImageDataToBlob,
  type DecodeDependencies,
} from './heicConverter';

describe('heicConverter', () => {
  it('デコード対象画像がない場合は失敗する', async () => {
    const dependencies: DecodeDependencies = {
      libheif: {
        HeifDecoder: class {
          decode() {
            return [];
          }
        },
      },
    };

    await expect(decodeHeicToImageData(new ArrayBuffer(0), dependencies)).rejects.toThrow(
      'HEIC画像を読み込めませんでした。',
    );
  });

  it('libheifのdisplay結果をImageDataとして返す', async () => {
    let freed = false;
    const data = new Uint8ClampedArray(8);
    const dependencies: DecodeDependencies = {
      createImageData: (width, height) => ({ width, height, data }) as ImageData,
      libheif: {
        HeifDecoder: class {
          decode() {
            return [
              {
                get_width: () => 2,
                get_height: () => 1,
                display: (imageData: ImageData, callback: (displayData: ImageData) => void) => {
                  imageData.data.set([255, 0, 0, 255, 0, 0, 0, 255]);
                  callback(imageData);
                },
                free: () => {
                  freed = true;
                },
              },
            ];
          }
        },
      },
    };

    const imageData = await decodeHeicToImageData(new ArrayBuffer(1), dependencies);

    expect(imageData.width).toBe(2);
    expect(imageData.height).toBe(1);
    expect(imageData.data[0]).toBe(255);
    expect(freed).toBe(true);
  });

  it('CanvasのtoBlobが失敗した場合はエラーを返す', async () => {
    const imageData = { width: 1, height: 1, data: new Uint8ClampedArray(4) } as ImageData;
    const canvas = {
      getContext: () => ({ putImageData: () => undefined }),
      toBlob: (callback: BlobCallback) => callback(null),
    } as unknown as HTMLCanvasElement;

    await expect(
      encodeImageDataToBlob(imageData, 'jpg', {
        createCanvas: () => canvas,
      }),
    ).rejects.toThrow('image/jpegへの変換に失敗しました。');
  });

  it('CanvasのBlobを変換済みBlobとして返す', async () => {
    const imageData = { width: 1, height: 1, data: new Uint8ClampedArray(4) } as ImageData;
    const canvas = {
      getContext: () => ({ putImageData: () => undefined }),
      toBlob: (callback: BlobCallback, type?: string) => {
        callback(new Blob(['ok'], { type }));
      },
    } as unknown as HTMLCanvasElement;

    const blob = await encodeImageDataToBlob(imageData, 'webp', {
      createCanvas: () => canvas,
    });

    expect(blob.type).toBe('image/webp');
  });
});
