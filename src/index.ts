import * as PIXI from "pixi.js";
import { functionMethods } from "./functionMethods";
import { GraphicsManager } from "./GraphicsManager";
import { ChooseCharacter } from "./ChooseCharacter";
import { StartGame } from "./StartGame";
import { MainGame } from "./MainGame";
import { gsapFunctions } from "./gsapFunctions";
import { EndGame } from "./EndGame";
import { utils } from "./utils";

class PixiApp {
  protected app: PIXI.Application = new PIXI.Application();

  protected chooseCharacter: any;
  protected startGame: any;
  protected mainGame: any;
  protected endGame: any;
  protected functionMethod: any;
  protected gsapFunctions: any;
  protected graphicsManager: any;
  protected registeredAssets: Set<string> = new Set();
  protected utils: any;

  constructor() {
    this.init();
  }

  //initialization of the Application
  async init() {
    // this.app = new PIXI.Application();
    // await this.app.init({ resizeTo: window });
    // document.body.appendChild(this.app.canvas);
    // this.utils = new utils();
    // this.gsapFunctions = new gsapFunctions(this.app);
    // this.graphicsManager = new GraphicsManager(this.app);
    // this.functionMethod = new functionMethods(
    //   this.app,
    //   this.loadStartBtn.bind(this),
    //   this.graphicsManager,
    //   this.gsapFunctions
    // );
    // this.chooseCharacter = new ChooseCharacter(
    //   this.app,
    //   this.functionMethod,
    //   this.graphicsManager
    // );
    // this.startGame = new StartGame(
    //   this.app,
    //   this.functionMethod,
    //   this.graphicsManager,
    //   this.chooseCharacter.chosenAnimation
    // );
    // this.endGame = new EndGame(
    //   this.app,
    //   this.functionMethod,
    //   this.graphicsManager,
    //   this.gsapFunctions
    // );
    // this.mainGame = new MainGame(
    //   this.app,
    //   this.functionMethod,
    //   this.graphicsManager,
    //   this.endGame,
    //   this.gsapFunctions
    // );
    // await this.loadAssets();
  }

  // async loadAssets() {
  //   // await this.app.stage.addChild(this.functionMethod.mainContainer);
  //   await this.functionMethod.loadBackground();
  //   await this.chooseCharacter.loadCharacterChoosing();
  //   await this.functionMethod.addChildrenToContainer(
  //     this.functionMethod.mainContainer,
  //     [
  //       this.functionMethod.citySprite1,
  //       this.functionMethod.citySprite2,
  //       this.chooseCharacter.skinChoices,
  //     ]
  //   );
  // }

  // async loadStartBtn(animation: PIXI.AnimatedSprite) {
  //   this.chooseCharacter.chosenAnimation = animation;
  //   await this.startGame.createStartBtn();

  //   this.functionMethod.addChildrenToContainer(
  //     this.functionMethod.mainContainer,
  //     [this.startGame.startContainer, this.chooseCharacter.chosenAnimation]
  //   );

  //   this.mainGame.clickStartBtn(
  //     this.startGame.startBtnBack,
  //     this.chooseCharacter.chosenAnimation,
  //     this.startGame.startContainer
  //   );

  //   this.functionMethod.chosenAnimationInit(
  //     this.chooseCharacter.chosenAnimation
  //   );
  // }
}

new PixiApp();
