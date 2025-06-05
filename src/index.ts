import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager";
import { functionMethods } from "./functionMethods";
import { ChooseCharacter } from "./ChooseCharacter";

class PixiApp extends functionMethods {
  protected app: PIXI.Application = new PIXI.Application();
  protected mainContainer: PIXI.Container = new PIXI.Container();
  protected citySprite!: PIXI.Sprite;
  protected graphicsManager: any;
  protected chooseCharacter: any;
  protected registeredAssets: Set<string> = new Set();

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

    this.chooseCharacter = new ChooseCharacter(this.app);
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
    this.citySprite = new PIXI.Sprite(cityTexture);
    this.evenHeight(this.citySprite, this.app.screen);
    this.evenWidth(this.citySprite, this.app.screen);
    this.citySprite.filters = new PIXI.BlurFilter({ strength: 8 });
    this.citySprite.anchor.set(0);
  }

  async loadAssets() {
    await this.loadBackground();
    await this.chooseCharacter.loadCharacterChoosing();
    await this.chooseCharacter.loadBirds();
    this.addChildrenToContainer(this.mainContainer, [
      this.citySprite,
      this.chooseCharacter.skinChoices,
    ]);
  }
}

new PixiApp();
