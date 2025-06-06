import * as PIXI from "pixi.js";

export class StartGame {
  protected startBtnBack!: PIXI.Sprite;
  protected graphicsManager!: any;
  protected functionMethods!: any;

  constructor(graphicsManager: any, functionMethods: any) {
    this.graphicsManager = graphicsManager;
    this.functionMethods = functionMethods;
  }

  async createStartBtn() {
    this.startBtnBack = await this.graphicsManager.createSprite("startBtnBase");
  }
}
