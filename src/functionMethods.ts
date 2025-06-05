import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";

export class functionMethods extends helperMethods {
  constructor() {
    super();
  }

  pixelBackground(element: any) {
    element.filters = new PIXI.BlurFilter({ strength: 8 });
  }
}
