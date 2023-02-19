export interface CharOffsetVal {
  char: string;
  y_offset: number;
  x_offset: number | null;
}

export interface ImageCache {
  image_name: string;
  char: string;
  image: HTMLImageElement;
  offsets: CharOffsetVal[];
}

export interface CharacterMap {
  src_path: string;
  char: string;
  name: string;
  offsets: CharOffsetVal[];
}

export interface DrawnChar {
  y_axis: number | null;
  x_axis: number | null;
  char: string;
  cached_image: ImageCache;
}
