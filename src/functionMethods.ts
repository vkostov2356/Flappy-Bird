import * as PIXI from "pixi.js";

export class functionMethods {
  constructor() {}

  pixelBackground(element: any) {
    element.filters = new PIXI.BlurFilter({ strength: 8 });
  }
}
