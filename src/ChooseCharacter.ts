import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager";
import { functionMethods } from "./functionMethods";

export class ChooseCharacter extends functionMethods {
  protected chosenSkinNumber!: number; //will hold the number of the chosen skin

  protected graphicsManager: any;
  protected skinChoices: PIXI.Container = this.createContainer();

  private mainContainer: PIXI.Container;
  private btnBack1!: PIXI.Sprite;
  private btnBack2!: PIXI.Sprite;
  private btnBack3!: PIXI.Sprite;
  private skin1!: PIXI.AnimatedSprite;
  private skin2!: PIXI.AnimatedSprite;
  private skin3!: PIXI.AnimatedSprite;
  private app: PIXI.Application;

  constructor(app: PIXI.Application, mainContainer: PIXI.Container) {
    super();
    this.app = app;
    this.mainContainer = mainContainer;
    this.graphicsManager = new GraphicsManager(
      this.app,
      this.btnBack1,
      this.btnBack2,
      this.btnBack3
    );
  }

  async loadCharacterChoosing() {
    this.btnBack1 = this.graphicsManager.createSprite("skinBase");
    this.btnBack1.x = this.app.screen.width / 2 - this.btnBack1.width * 2;
    this.btnBack2 = this.graphicsManager.createSprite("skinBase");
    this.btnBack2.x = this.app.screen.width / 2 - this.btnBack2.width / 2;
    this.btnBack3 = this.graphicsManager.createSprite("skinBase");
    this.btnBack3.x = this.app.screen.width / 2 + this.btnBack3.width;
    this.btnBack1!.onpointerover = () => {
      this.startAnimation(this.skin1!);
    };
    this.btnBack1!.onpointerout = () => {
      this.stopAnimation(this.skin1!);
    };

    this.btnBack2!.onpointerover = () => {
      this.startAnimation(this.skin2!);
    };
    this.btnBack2!.onpointerout = () => {
      this.stopAnimation(this.skin2!);
    };

    this.btnBack3!.onpointerover = () => {
      this.startAnimation(this.skin3!);
    };
    this.btnBack3!.onpointerout = () => {
      this.stopAnimation(this.skin3!);
    };

    this.chosenSkin(
      this.btnBack1,
      this.mainContainer,
      this.skinChoices,
      this.city
    );

    this.addChildrenToContainer(this.skinChoices, [
      this.btnBack1,
      this.btnBack2,
      this.btnBack3,
    ]);
    this.skinChoices.x = 0;
    this.skinChoices.y = this.app.screen.height / 2 - this.btnBack1.height / 2;
    this.city.zIndex = 1;
    this.skinChoices.zIndex = 2;
    this.pixelBackground(this.city);
  }

  async loadBirds() {
    this.skin1 = await this.graphicsManager.createSkinAnimation(
      1,
      this.btnBack1
    );

    this.skin2 = await this.graphicsManager.createSkinAnimation(
      2,
      this.btnBack2
    );
    this.skin3 = await this.graphicsManager.createSkinAnimation(
      3,
      this.btnBack3
    );

    this.addChildrenToContainer(this.skinChoices, [
      this.skin1,
      this.skin2,
      this.skin3,
    ]);
  }
}
