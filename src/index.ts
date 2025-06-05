import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";
import { GraphicsManager } from "./GraphicsManager";

class PixiApp extends helperMethods {
  protected app: PIXI.Application = new PIXI.Application();
  protected mainContainer: PIXI.Container = this.createContainer();
  protected city!: PIXI.Sprite;
  protected skinChoices: PIXI.Container = this.createContainer();
  protected graphicsManager: any;
  protected registeredAssets: Set<string> = new Set();

  protected btnBack1!: PIXI.Sprite;
  protected btnBack2!: PIXI.Sprite;
  protected btnBack3!: PIXI.Sprite;
  protected skin1!: PIXI.AnimatedSprite;
  protected skin2!: PIXI.AnimatedSprite;
  protected skin3!: PIXI.AnimatedSprite;

  constructor() {
    super();
    this.init();
  }

  //initialization of the Application
  async init() {
    this.app = new PIXI.Application();
    await this.app.init({ resizeTo: window });
    document.body.appendChild(this.app.canvas);
    this.loadMainContainer();
    this.graphicsManager = new GraphicsManager(
      this.app,
      this.btnBack1,
      this.btnBack2,
      this.btnBack3
    );
  }

  //creation of the mainContainer
  async loadMainContainer() {
    this.app.stage.addChild(this.mainContainer);
    this.loadAssets();
  }

  //loading the main Background
  async loadBackground() {
    const cityTexture: PIXI.Texture = await PIXI.Assets.load(
      "smallSizeCityBackground.webp"
    );
    this.city = new PIXI.Sprite(cityTexture);
    this.evenHeight(this.city, this.app.screen);
    this.evenWidth(this.city, this.app.screen);

    this.city.anchor.set(0);

    this.loadCharacterChoosing();
    this.loadBirds();
  }

  //loading the character choosing container
  async loadCharacterChoosing() {
    this.btnBack1 = this.graphicsManager.createSprite("skinBase");
    this.btnBack1.x = this.app.screen.width / 2 - this.btnBack1.width * 2;
    this.btnBack2 = this.graphicsManager.createSprite("skinBase");
    this.btnBack2.x = this.app.screen.width / 2 - this.btnBack2.width / 2;
    this.btnBack3 = this.graphicsManager.createSprite("skinBase");
    this.btnBack3.x = this.app.screen.width / 2 + this.btnBack3.width;
    this.btnBack1!.onpointerover = () => {
      this.startAnimation(this.skin1!);
    };
    this.btnBack1!.onpointerout = () => {
      this.stopAnimation(this.skin1!);
    };

    this.btnBack2!.onpointerover = () => {
      this.startAnimation(this.skin2!);
    };
    this.btnBack2!.onpointerout = () => {
      this.stopAnimation(this.skin2!);
    };

    this.btnBack3!.onpointerover = () => {
      this.startAnimation(this.skin3!);
    };
    this.btnBack3!.onpointerout = () => {
      this.stopAnimation(this.skin3!);
    };

    this.addChildrenToContainer(this.skinChoices, [
      this.btnBack1,
      this.btnBack2,
      this.btnBack3,
    ]);
    this.skinChoices.x = 0;
    this.skinChoices.y = this.app.screen.height / 2 - this.btnBack1.height / 2;
    this.city.zIndex = 1;
    this.skinChoices.zIndex = 2;
    this.pixelBackground(this.city);
  }

  async loadBirds() {
    this.skin1 = await this.graphicsManager.createSkinAnimation(
      1,
      //   "skin1-up.png",
      //   "skin1-down.png",
      this.btnBack1
    );

    this.skin2 = await this.graphicsManager.createSkinAnimation(
      2,
      //   "skin2-up.png",
      //   "skin2-down.png",
      this.btnBack2
    );
    this.skin3 = await this.graphicsManager.createSkinAnimation(
      3,
      //   "skin3-up.png",
      //   "skin3-down.png",
      this.btnBack3
    );

    this.addChildrenToContainer(this.skinChoices, [
      this.skin1,
      this.skin2,
      this.skin3,
    ]);
  }

  async loadAssets() {
    await this.loadBackground();
    await this.loadCharacterChoosing();
    await this.loadBirds();
    await this.addChildrenToContainer(this.mainContainer, [
      this.city,
      this.skinChoices,
    ]);
  }
}

new PixiApp();
