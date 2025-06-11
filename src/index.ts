import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager";
import { UIElements } from "./UI-Elements";
import { utils } from "./utils";
import { gsapFunctions } from "./gsapFunctions";

class FlappyBird {
  protected app!: PIXI.Application;
  protected utils: utils = new utils();
  protected graphicsManager!: GraphicsManager;
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
    this.loadMainContainer();
  }

  async loadMainContainer() {
    this.mainContainer = new PIXI.Container();
    this.app.stage.addChild(this.mainContainer);

    this.loadGraphics();
  }
  async loadGraphics() {
    this.graphicsManager = new GraphicsManager(this.utils, this.app);
    await this.graphicsManager.loadTextures();
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
