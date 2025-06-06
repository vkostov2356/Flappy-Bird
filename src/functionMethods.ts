import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";
import gsap from "gsap";

export class functionMethods extends helperMethods {
  protected mainContainer: PIXI.Container = new PIXI.Container();
  protected citySprite!: PIXI.Sprite;
  private blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter({ strength: 8 });

  private loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>;

  protected tapOrClick!: PIXI.Sprite;
  // protected click!: PIXI.Sprite;

  protected app?: PIXI.Application;
  protected ticker: PIXI.Ticker = new PIXI.Ticker();
  constructor(
    app: PIXI.Application,
    loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>
  ) {
    super();
    this.app = app;
    this.loadStartBtn = loadStartBtn;
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
        animations[i].y = this.app!.screen.height / 2 / 2;
        animations[i].x = this.app!.screen.width / 2;
        this.loadStartBtn(animations[i]);
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
        this.blurFilter.strength -= 0.1;
        console.log("blur is decreasing");
      } else {
        this.citySprite.filters = [];
        this.ticker.stop();
      }
    });
    this.ticker.start();
  }

  //click Start button

  clickStartBtn(
    element: PIXI.Sprite,
    animation: PIXI.AnimatedSprite,
    child: PIXI.Container
  ) {
    element.onpointerdown = () => {
      this.removePixelBackground(), this.removeChild(this.mainContainer, child);

      gsap.to(animation, {
        x: this.app!.screen.width + animation.width,
        duration: 2,
        ease: "power1.inOut",
        onComplete: () => {
          animation.width = animation.width / 2;
          animation.height = animation.height / 2;
          gsap.fromTo(
            animation,
            { x: 0 },
            { x: animation.width * 2, duration: 0.5 }
          );
        },
      });
    };
  }
}
