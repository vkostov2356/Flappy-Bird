import * as PIXI from "pixi.js";

export class MainGame {
  private app!: PIXI.Application;
  private functionMethods!: any;
  private graphicsMethods!: any;

  //   protected obstacle!: PIXI.Container;
  //   protected upperObstacle!: PIXI.Sprite;
  //   protected lowerObstacle!: PIXI.Sprite;

  constructor(
    app: PIXI.Application,
    functionMethods: any,
    graphicsMethods: any
  ) {
    this.app = app;
    this.functionMethods = functionMethods;
    this.graphicsMethods = graphicsMethods;
  }

  //   async renderObstacles() {
  //     this.obstacle = this.graphicsMethods.createContainer();
  //     this.upperObstacle = this.graphicsMethods.createBackground(
  //       "#109970",
  //       1,
  //       20,
  //       50,
  //       150,
  //       150
  //     );
  //   }
}
