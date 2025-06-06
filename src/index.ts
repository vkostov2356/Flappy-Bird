import * as PIXI from "pixi.js";
import { functionMethods } from "./functionMethods";
import { GraphicsManager } from "./GraphicsManager";
import { ChooseCharacter } from "./ChooseCharacter";
import { StartGame } from "./StartGame";

class PixiApp {
  protected app: PIXI.Application = new PIXI.Application();

  protected chooseCharacter: any;
  protected startGame: any;
  protected functionMethod: any;
  protected graphicsManager: any;
  protected registeredAssets: Set<string> = new Set();

  constructor() {
    this.init();
  }

  //initialization of the Application
  async init() {
    this.app = new PIXI.Application();
    await this.app.init({ resizeTo: window });
    document.body.appendChild(this.app.canvas);

    this.functionMethod = new functionMethods(this.app);
    this.graphicsManager = new GraphicsManager(this.app);
    this.chooseCharacter = new ChooseCharacter(
      this.app,
      this.functionMethod,
      this.graphicsManager
    );
    this.startGame = new StartGame(this.functionMethod, this.graphicsManager);

    this.loadAssets();
  }

  async loadAssets() {
    this.app.stage.addChild(this.functionMethod.mainContainer);
    await this.functionMethod.loadBackground();
    await this.chooseCharacter.loadCharacterChoosing();
    this.functionMethod.addChildrenToContainer(
      this.functionMethod.mainContainer,
      [this.functionMethod.citySprite, this.chooseCharacter.skinChoices]
    );
  }

  async loadStartBtn() {
    this.functionMethod.addChildrenToContainer(
      this.functionMethod.mainContainer,
      [this.startGame.startBtnBack]
    );
  }
}

new PixiApp();
