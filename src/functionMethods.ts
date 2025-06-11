import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";
import gsap from "gsap";

export class functionMethods extends helperMethods {
  //the main container in the game
  protected mainContainer: PIXI.Container = new PIXI.Container();
  private obstaclesContainer: PIXI.Container = new PIXI.Container();
  private tickerBack: PIXI.Ticker = new PIXI.Ticker();

  protected citySprite1!: PIXI.Sprite;
  protected citySprite2!: PIXI.Sprite;
  protected isPlaying: boolean = false;
  private blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter({ strength: 8 });

  private loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>;

  protected gsapMove!: any;
  protected singleObstaclesContainer = new PIXI.Container();

  protected app?: PIXI.Application;
  protected graphicsManager: any;
  protected gsapFunctions: any;
  protected tickerBlur: PIXI.Ticker = new PIXI.Ticker();
  protected chosenAnimation!: PIXI.AnimatedSprite | undefined;

  constructor(
    app: PIXI.Application,
    loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>,
    graphicsManager: any,
    gsapFunctions: any
  ) {
    super();
    this.app = app;
    this.loadStartBtn = loadStartBtn;
    this.graphicsManager = graphicsManager;
    this.gsapFunctions = gsapFunctions;
  }

  // chosenAnimationInit(chosenAnimation: PIXI.AnimatedSprite) {
  //   this.chosenAnimation = chosenAnimation;
  // }

  // //loading the main Background
  // async loadBackground() {
  //   const cityTexture: PIXI.Texture = await PIXI.Assets.load(
  //     "smallSizeCityBackground.webp"
  //   );
  //   this.citySprite1 = new PIXI.Sprite(cityTexture);
  //   this.citySprite2 = new PIXI.Sprite(cityTexture);
  //   this.evenHeight(this.citySprite1, this.app!.screen);
  //   this.evenWidth(this.citySprite1, this.app!.screen);
  //   this.evenHeight(this.citySprite2, this.app!.screen);
  //   this.evenWidth(this.citySprite2, this.app!.screen);
  //   this.addPixelBackground();
  //   this.citySprite1.anchor.set(0);
  //   this.citySprite2.anchor.set(0);
  //   this.citySprite1.x = 0;
  //   this.citySprite2.x = this.citySprite1.width;
  // }

  // //choosing skin
  // chosenSkin(
  //   elements: PIXI.Sprite[],
  //   animations: PIXI.AnimatedSprite[],
  //   child: PIXI.Container
  // ) {
  //   for (let i = 0; i < elements.length; i++) {
  //     elements[i].onpointerdown = () => {
  //       this.removeChild(this.mainContainer, child);
  //       animations[i].y = this.app!.screen.height / 2 / 2;
  //       animations[i].x = this.app!.screen.width / 2;
  //       this.loadStartBtn(animations[i]);
  //       return animations[i];
  //     };
  //   }
  // }

  // addPixelBackground() {
  //   this.citySprite1.filters = [this.blurFilter];
  // }

  // removePixelBackground() {
  //   this.tickerBlur.add(() => {
  //     if (this.blurFilter.strength > 0) {
  //       this.blurFilter.strength -= 0.1;
  //     } else {
  //       this.citySprite1.filters = [];
  //       this.tickerBlur.stop();
  //     }
  //   });
  //   this.tickerBlur.start();
  // }

  // startingPositionBird(animation: PIXI.AnimatedSprite, callback: () => void) {
  //   gsap.fromTo(
  //     animation,
  //     { x: 0, y: this.app!.screen.height / 2 / 2 },
  //     {
  //       x: animation.width * 2,
  //       duration: 0.1, //1
  //       onComplete: () => {
  //         callback();
  //       },
  //     }
  //   );
  // }

  // restartBackground() {
  //   this.citySprite1.x -= 1;
  //   this.citySprite2.x -= 1;

  //   if (this.citySprite1.x + this.citySprite1.width <= 0) {
  //     this.citySprite1.x = this.citySprite2.x + this.citySprite2.width;
  //   }

  //   if (this.citySprite2.x + this.citySprite2.width <= 0) {
  //     this.citySprite2.x = this.citySprite1.x + this.citySprite1.width;
  //   }
  // }

  // moveBackground(moveObstacles: () => void, dropBird: () => void) {
  //   this.citySprite1.eventMode = this.citySprite2.eventMode = "static";
  //   this.citySprite1.cursor = this.citySprite2.cursor = "pointer";

  //   this.tickerBack = this.graphicsManager.createTicker(); // Reset the ticker
  //   const tickerStarStop = (element: PIXI.Sprite) => {
  //     element.onpointerdown = () => {
  //       this.tickerBack.start();
  //       moveObstacles();
  //       this.isPlaying = true;
  //       dropBird();
  //     };
  //   };
  //   this.tickerBack.add(() => {
  //     this.restartBackground();
  //   });

  //   tickerStarStop(this.citySprite1);
  //   tickerStarStop(this.citySprite2);
  // }
}
