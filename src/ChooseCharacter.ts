import * as PIXI from "pixi.js";

export class ChooseCharacter {
  protected chosenAnimation!: PIXI.AnimatedSprite;
  protected graphicsManager: any;
  protected skinChoices!: PIXI.Container;

  protected functionMethod: any;

  private btnBack1!: PIXI.Sprite;
  private btnBack2!: PIXI.Sprite;
  private btnBack3!: PIXI.Sprite;
  private skin1!: PIXI.AnimatedSprite;
  private skin2!: PIXI.AnimatedSprite;
  private skin3!: PIXI.AnimatedSprite;
  private app: PIXI.Application;

  constructor(
    app: PIXI.Application,
    functionMethod: any,
    graphicsManager: any
  ) {
    this.app = app;
    this.graphicsManager = graphicsManager;
    this.skinChoices = this.graphicsManager.createContainer();
    this.functionMethod = functionMethod;
  }

  async loadCharacterChoosing() {
    this.btnBack1 = this.graphicsManager.createSprite("skinBase");
    this.btnBack1.x = this.app.screen.width / 2 - this.btnBack1.width * 2;
    this.btnBack2 = this.graphicsManager.createSprite("skinBase");
    this.btnBack2.x = this.app.screen.width / 2 - this.btnBack2.width / 2;
    this.btnBack3 = this.graphicsManager.createSprite("skinBase");
    this.btnBack3.x = this.app.screen.width / 2 + this.btnBack3.width;

    this.functionMethod.addChildrenToContainer(this.skinChoices, [
      this.btnBack1,
      this.btnBack2,
      this.btnBack3,
    ]);
    this.skinChoices.x = 0;
    this.skinChoices.y = this.app.screen.height / 2 - this.btnBack1.height / 2;
    this.loadBirds();
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

    this.functionMethod.addChildrenToContainer(this.skinChoices, [
      this.skin1,
      this.skin2,
      this.skin3,
    ]);

    this.functionMethod.chosenSkin(
      [this.btnBack1, this.btnBack2, this.btnBack3],
      [this.skin1, this.skin2, this.skin3],
      this.skinChoices
    );

    await this.functionMethod.startAnimation(
      [this.btnBack1, this.btnBack2, this.btnBack3],
      [this.skin1, this.skin2, this.skin3]
    );
    await this.functionMethod.stopAnimation(
      [this.btnBack1, this.btnBack2, this.btnBack3],
      [this.skin1, this.skin2, this.skin3]
    );
  }
}
