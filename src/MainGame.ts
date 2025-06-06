import * as PIXI from "pixi.js";

export class MainGame {
  private app!: PIXI.Application;
  private functionMethods!: any;
  private graphicsMethods!: any;

  constructor(
    app: PIXI.Application,
    functionMethods: any,
    graphicsMethods: any
  ) {
    this.app = app;
    this.functionMethods = functionMethods;
    this.graphicsMethods = graphicsMethods;
  }
}
