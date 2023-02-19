import path from "node:path";
import { ImageCache, CharacterMap, DrawnChar } from "./interfaces";

const IMG_DOWNSCALE_FACTOR = 4;

export class TranslatorApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private imageMap: ImageCache[];

  private drawnCharacters: DrawnChar[] = [];

  constructor(character_mapping: CharacterMap[]) {
    this.canvas = document.getElementById(
      "translator-canvas"
    ) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.imageMap = this.createImageCache(character_mapping);
  }

  private createImageCache(character_mapping: CharacterMap[]): ImageCache[] {
    let image_caches = [];
    for (let mapping of character_mapping) {
      let img = new Image();
      img.src = mapping.src_path;
      image_caches.push({
        image: img,
        char: mapping.char,
        image_name: mapping.name,
        offsets: mapping.offsets,
      });
    }
    return image_caches;
  }

  private calculateTranslationCoords(char: string) {
    let cached_image: ImageCache = this.imageMap.find((i) => i.char == char);
    if (!cached_image) {
      console.warn(`Could not load image for char ${char}`);
      return;
    }

    let previous_drawn_char: DrawnChar | null = null;
    if (this.drawnCharacters.length > 0) {
      previous_drawn_char =
        this.drawnCharacters[this.drawnCharacters.length - 1];
    }
    console.log(`Previous Char Y Axis: ${previous_drawn_char?.y_axis}`);

    // apply character offsets
    let y_axis = previous_drawn_char?.y_axis | 0;
    let x_axis = 0;

    if (previous_drawn_char?.y_axis != null && char != " ") {
      let offset = cached_image.offsets.find(
        (o) => o.char == previous_drawn_char.char
      );
      if (offset) {
        y_axis += offset.y_offset;
        x_axis = offset.x_offset | 0;
      }
    } else {
      // Handle spaces
      y_axis += 50;
      x_axis = 0;
    }

    console.log(`y-axis: ${y_axis}`);
    this.drawnCharacters.push({
      x_axis: x_axis,
      y_axis: y_axis,
      char: char,
      cached_image: cached_image,
    } as DrawnChar);
  }

  private drawImages() {
    for (let dc of this.drawnCharacters) {
      if (dc.char == " ") continue;
      let img_width = dc.cached_image.image.width / IMG_DOWNSCALE_FACTOR;
      let img_height = dc.cached_image.image.height / IMG_DOWNSCALE_FACTOR;
      this.context.drawImage(
        dc.cached_image.image,
        dc.x_axis + 10,
        dc.y_axis,
        img_width,
        img_height
      );
    }
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log("Cleared canvas");
  }

  public handleTranslation(characters: string[]) {
    this.clearCanvas();

    this.calculateTranslationCoords(characters[characters.length - 1]);

    console.log(this.drawnCharacters);
    this.drawImages();
  }

  public reset() {
    this.drawnCharacters = [];
    this.clearCanvas();
  }
}
