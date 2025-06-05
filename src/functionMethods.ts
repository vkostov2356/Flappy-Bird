import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";

export class functionMethods extends helperMethods {
  constructor() {
    super();
  }

  chosenSkin(element: PIXI.Sprite, chosenSkin: number, number: number) {
    element.onpointerdown = () => {
      chosenSkin = number;
      console.log(chosenSkin);
    };
  }

  pixelBackground(element: any) {
    element.filters = new PIXI.BlurFilter({ strength: 8 });
  }
}
