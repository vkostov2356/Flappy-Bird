import * as PIXI from "pixi.js";

export class StartGame {
  protected startContainer: PIXI.Container = new PIXI.Container();
  protected startBtnBack!: PIXI.Sprite;
  protected startText!: PIXI.Text;
  protected graphicsManager!: any;
  protected functionMethods!: any;
  private app: PIXI.Application;
  private chosenAnimation!: PIXI.AnimatedSprite;

  constructor(
    app: PIXI.Application,
    functionMethods: any,
    graphicsManager: any,
    chosenAnimation: PIXI.AnimatedSprite
  ) {
    this.app = app;
    this.graphicsManager = graphicsManager;
    this.functionMethods = functionMethods;
    this.chosenAnimation = chosenAnimation;
  }

  // async createStartBtn() {
  //   this.startBtnBack = await this.graphicsManager.createSprite("startBtnBase");
  //   this.startText = await this.graphicsManager.createText(
  //     "START",
  //     25,
  //     "#000000"
  //   );
  //   this.functionMethods.hoverScale(
  //     [this.startBtnBack, this.startText],
  //     this.app.screen
  //   );
  //   this.functionMethods.centerElement(this.app.screen, this.startText);
  //   this.functionMethods.centerElement(this.app.screen, this.startBtnBack);

  //   this.functionMethods.addChildrenToContainer(this.startContainer, [
  //     this.startBtnBack,
  //     this.startText,
  //   ]);
  // }
}
