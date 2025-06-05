import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";

export class functionMethods extends helperMethods {
  protected mainContainer: PIXI.Container = new PIXI.Container();
  protected citySprite!: PIXI.Sprite;

  protected app?: PIXI.Application;

  constructor(app?: PIXI.Application) {
    super();
    this.app = app;
  }

  //loading the main Background
  async loadBackground() {
    const cityTexture: PIXI.Texture = await PIXI.Assets.load(
      "smallSizeCityBackground.webp"
    );
    this.citySprite = new PIXI.Sprite(cityTexture);
    this.evenHeight(this.citySprite, this.app!.screen);
    this.evenWidth(this.citySprite, this.app!.screen);
    this.citySprite.filters = new PIXI.BlurFilter({ strength: 8 });
    this.citySprite.anchor.set(0);
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
