import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager1";
import { UIElements } from "./UI-Elements";
import { utils } from "./utils";
import { gsapFunctions } from "./gsapFunctions";

class FlappyBird {
  protected app!: PIXI.Application;
  protected utils: utils = new utils();
  protected graphicsManager: GraphicsManager = new GraphicsManager(this.utils);
  protected UIElements!: UIElements;
  protected gsapFunctions!: gsapFunctions;

  protected mainContainer!: PIXI.Container;

  constructor() {
    this.init();
  }

  async init() {
    //app initialization
    this.app = new PIXI.Application();
    await this.app.init({ resizeTo: window });
    document.body.appendChild(this.app.canvas);
  }

  async loadMainContainer() {
    this.mainContainer = this.graphicsManager.createContainer();
    this.app.stage.addChild(this.mainContainer);

    this.loadClasses();
  }

  loadClasses() {
    //loading classes
    this.gsapFunctions = new gsapFunctions(this.app);
    this.UIElements = new UIElements(
      this.app,
      this.utils,
      this.graphicsManager,
      this.gsapFunctions,
      this.mainContainer
    );
  }
}

new FlappyBird();
