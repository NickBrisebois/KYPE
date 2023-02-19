import path from "node:path";
import { ImageCache, CharacterMap, DrawnChar } from "./interfaces";

const IMG_DOWNSCALE_FACTOR = 4;
const GUIDELINE_ONE_X = 21;
const GUIDELINE_TWO_X = 70;

export class TranslatorApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private imageMap: ImageCache[];

  private drawnCharacters: DrawnChar[] = [];
  private useGuidelines: boolean = false;

  constructor(
    characterMapping: CharacterMap[],
    useGuidelines: boolean = false
  ) {
    this.canvas = document.getElementById(
      "translator-canvas"
    ) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.imageMap = this.createImageCache(characterMapping);
    this.useGuidelines = useGuidelines;
    if (this.useGuidelines) this.drawGuidelines();
  }

  private createImageCache(characterMapping: CharacterMap[]): ImageCache[] {
    let image_caches = [];
    for (let mapping of characterMapping) {
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

    let previousDrawnChar: DrawnChar | null = null;
    if (this.drawnCharacters.length > 0) {
      previousDrawnChar = this.drawnCharacters[this.drawnCharacters.length - 1];
    }
    console.log(`Previous Char Y Axis: ${previousDrawnChar?.y_axis}`);

    // apply character offsets
    let y_axis = previousDrawnChar?.y_axis | 0;
    let x_axis = 0;

    const self_offset = cached_image.offsets.find((o) => o.char == char);
    if (self_offset) {
      (y_axis += self_offset.y_offset), (x_axis += self_offset.x_offset);
    }

    if (previousDrawnChar?.y_axis != null && char != " ") {
      let offset = cached_image.offsets.find(
        (o) => o.char == previousDrawnChar.char
      );
      if (offset) {
        y_axis += offset.y_offset;
        x_axis += offset.x_offset;
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
    this.drawGuidelines();
  }

  public drawGuidelines() {
    if (this.useGuidelines) {
      this.context.beginPath();
      this.context.setLineDash([1, 3]);
      this.context.moveTo(GUIDELINE_ONE_X, 0);
      this.context.lineTo(GUIDELINE_ONE_X, this.canvas.height);
      this.context.stroke();

      this.context.beginPath();
      this.context.setLineDash([1, 3]);
      this.context.moveTo(GUIDELINE_TWO_X, 0);
      this.context.lineTo(GUIDELINE_TWO_X, this.canvas.height);
      this.context.stroke();
    }
  }

  public handleBackspace() {
    this.clearCanvas();
    this.drawnCharacters.pop();
    this.drawImages();
    this.drawGuidelines();
  }

  public getCanvasAsImage(): string {
    const image = this.canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    return image;
  }

  public reset() {
    this.drawnCharacters = [];
    this.clearCanvas();

    this.drawGuidelines();
  }
}
