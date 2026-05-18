import libheifRuntime, { type LibHeif } from 'libheif-js/wasm-bundle';
import { getOutputFormatConfig } from './outputFormat';
import { asConvertedBlob, type ConvertedBlob, type OutputFormat } from './types';

export interface DecodeDependencies {
  libheif?: LibHeif;
  createImageData?: (width: number, height: number) => ImageData;
}

export interface EncodeDependencies {
  createCanvas?: (width: number, height: number) => HTMLCanvasElement;
}

export interface ConversionDependencies extends DecodeDependencies, EncodeDependencies {}

export async function convertHeicArrayBuffer(
  arrayBuffer: ArrayBuffer,
  format: OutputFormat,
  dependencies: ConversionDependencies = {},
): Promise<ConvertedBlob> {
  const imageData = await decodeHeicToImageData(arrayBuffer, dependencies);
  return encodeImageDataToBlob(imageData, format, dependencies);
}

export async function decodeHeicToImageData(
  arrayBuffer: ArrayBuffer,
  dependencies: DecodeDependencies = {},
): Promise<ImageData> {
  const runtime = dependencies.libheif ?? libheifRuntime;
  const createImageData = dependencies.createImageData ?? createBrowserImageData;
  const decoder = new runtime.HeifDecoder();
  const images = decoder.decode(new Uint8Array(arrayBuffer));
  const image = images[0];

  if (!image) {
    throw new Error('HEIC画像を読み込めませんでした。');
  }

  const width = image.get_width();
  const height = image.get_height();

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    image.free?.();
    throw new Error('画像サイズを取得できませんでした。');
  }

  const imageData = createImageData(width, height);

  return new Promise((resolve, reject) => {
    try {
      image.display(imageData, (displayData) => {
        image.free?.();

        if (!displayData) {
          reject(new Error('HEIC画像のデコードに失敗しました。'));
          return;
        }

        resolve(displayData);
      });
    } catch (error) {
      image.free?.();
      reject(error);
    }
  });
}

export async function encodeImageDataToBlob(
  imageData: ImageData,
  format: OutputFormat,
  dependencies: EncodeDependencies = {},
): Promise<ConvertedBlob> {
  const createCanvas = dependencies.createCanvas ?? createBrowserCanvas;
  const canvas = createCanvas(imageData.width, imageData.height);
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvasを初期化できませんでした。');
  }

  context.putImageData(imageData, 0, 0);

  const { mimeType, quality } = getOutputFormatConfig(format);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error(`${mimeType}への変換に失敗しました。`));
          return;
        }

        resolve(result);
      },
      mimeType,
      quality,
    );
  });

  return asConvertedBlob(blob);
}

function createBrowserImageData(width: number, height: number): ImageData {
  if (typeof ImageData === 'undefined') {
    throw new Error('このブラウザではImageDataを利用できません。');
  }

  return new ImageData(width, height);
}

function createBrowserCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document === 'undefined') {
    throw new Error('この環境ではCanvasを利用できません。');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return canvas;
}
