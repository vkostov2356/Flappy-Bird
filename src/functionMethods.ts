import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";

export class functionMethods extends helperMethods {
  protected mainContainer: PIXI.Container = new PIXI.Container();
  protected citySprite!: PIXI.Sprite;
  private blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter({ strength: 8 });

  protected app?: PIXI.Application;
  protected ticker: PIXI.Ticker = new PIXI.Ticker();
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
    this.addPixelBackground();
    this.citySprite.anchor.set(0);
  }

  // //choosing skin
  chosenSkin(
    elements: PIXI.Sprite[],
    animations: PIXI.AnimatedSprite[],
    child: PIXI.Container
  ) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].onpointerdown = () => {
        this.removeChild(this.mainContainer, child);
        // this.removePixelBackground();
        return animations[i];
      };
    }
  }

  addPixelBackground() {
    this.citySprite.filters = [this.blurFilter];
  }

  removePixelBackground() {
    this.ticker.add(() => {
      if (this.blurFilter.strength > 0) {
        this.blurFilter.strength -= 0.2;
        console.log("blur is decreasing");
      } else {
        this.citySprite.filters = [];
        this.ticker.stop();
      }
    });
    this.ticker.start();
  }
}
