
export interface ImageData {
  src: string;
  mimeType: string;
}

export interface ImageState {
  original: ImageData;
  current: ImageData;
}
