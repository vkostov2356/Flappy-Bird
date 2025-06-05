import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager";
import { functionMethods } from "./functionMethods";
import { ChooseCharacter } from "./ChooseCharacter";

class PixiApp {
  protected app: PIXI.Application = new PIXI.Application();

  protected graphicsManager: any;
  protected chooseCharacter: any;
  protected functionMethod: any;
  protected registeredAssets: Set<string> = new Set();

  constructor() {
    this.init();
  }

  //initialization of the Application
  async init() {
    this.app = new PIXI.Application();
    await this.app.init({ resizeTo: window });
    document.body.appendChild(this.app.canvas);

    this.chooseCharacter = new ChooseCharacter(this.app);
    this.functionMethod = new functionMethods(this.app);

    this.loadMainContainer();
  }

  //creation of the mainContainer
  async loadMainContainer() {
    this.app.stage.addChild(this.functionMethod.mainContainer);
    this.loadAssets();
  }

  async loadAssets() {
    await this.functionMethod.loadBackground();
    await this.chooseCharacter.loadCharacterChoosing();
    this.functionMethod.addChildrenToContainer(
      this.functionMethod.mainContainer,
      [this.functionMethod.citySprite, this.chooseCharacter.skinChoices]
    );
  }
}

new PixiApp();
