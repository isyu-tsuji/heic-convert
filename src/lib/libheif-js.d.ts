declare module 'libheif-js/wasm-bundle' {
  export interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(imageData: ImageData, callback: (displayData: ImageData | null) => void): void;
    free?(): void;
  }

  export interface HeifDecoder {
    decode(data: Uint8Array | ArrayBuffer): HeifImage[];
  }

  export interface LibHeif {
    HeifDecoder: new () => HeifDecoder;
  }

  const libheif: LibHeif;
  export default libheif;
}
