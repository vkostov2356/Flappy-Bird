import * as PIXI from "pixi.js";
import { utils } from "./utils";

export class GraphicsManager {
  private utils: utils;
  private app?: PIXI.Application;
  public textures: Map<string, PIXI.Texture> = new Map();
  private registeredAssets: Set<string> = new Set();

  public blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter({ strength: 8 });
  public backgroundTicker: PIXI.Ticker = new PIXI.Ticker();
  public birdDropTicker: PIXI.Ticker = new PIXI.Ticker();
  public obstaclesTicker: PIXI.Ticker = new PIXI.Ticker();

  constructor(utils: utils, app?: PIXI.Application) {
    this.utils = utils;
    this.app = app;
    this.loadTextures();
  }

  public async loadTextures() {
    await this.createTextures();
  }

  //1. Create PIXI Elements

  //1.1 Create sprite from texture
  createSprite(name: string) {
    let texture: PIXI.Texture | undefined = this.getTexture(name);
    if (!texture) throw new Error(`Texture '${name}' not found`);
    const newSprite = new PIXI.Sprite(texture);
    newSprite.eventMode = "static";
    newSprite.cursor = "pointer";
    return newSprite;
  }

  //1.2 Create PIXI container
  createContainer() {
    return new PIXI.Container();
  }

  //1.3 Create PIXI Ticker
  createTicker() {
    return new PIXI.Ticker();
  }

  //1.4 Create PIXI Rounded Background with Graphics
  createRoundedGraphics(
    fill: string,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    alpha: number = 1
  ) {
    const rBack: PIXI.Graphics = new PIXI.Graphics();
    rBack.fill(fill);
    rBack.roundRect(x, y, w, h, radius);
    rBack.fill();
    rBack.alpha = alpha;
    return rBack;
  }

  //1.5 Create PIXI Text
  createText(text: string, fontSize: number, fill: string) {
    return new PIXI.Text({
      text: text,
      style: {
        fontFamily: "'Lucida Handwriting', cursive",
        fontSize: fontSize,
        fontWeight: "bold",
        fill: fill,
        align: "center",
      },
    });
  }

  //create textures and store them in a map
  private async createTextures() {
    //create background of the chooseSkin buttons
    const skinBase = this.createRoundedGraphics(
      "rgb(255, 255, 255)",
      0,
      0,
      150,
      150,
      10,
      0.8
    );
    skinBase.stroke({ width: 5, color: "#F79370", alpha: 1 });
    const skinBaseTexture = this.app!.renderer.generateTexture(skinBase);
    this.textures.set("skinBase", skinBaseTexture);

    //create score board after game over
    const scoreBoardBase = this.createRoundedGraphics(
      "rgb(255, 255, 255)",
      0,
      0,
      this.app!.screen.width / 5,
      this.app!.screen.height / 3,
      10,
      0.8
    );
    scoreBoardBase.stroke({ width: 5, color: "rgb(201, 100, 100)", alpha: 1 });
    const scoreBoardBaseTexture =
      this.app!.renderer.generateTexture(scoreBoardBase);
    this.textures.set("scoreBoardBase", scoreBoardBaseTexture);

    //create start button texture
    const startBtnBase = this.createRoundedGraphics(
      "rgb(255, 255, 255)",
      0,
      0,
      150,
      70,
      10,
      0.8
    );
    startBtnBase.stroke({ width: 5, color: "rgb(21, 234, 39)", alpha: 1 });
    const startBtnBaseTexture =
      this.app!.renderer.generateTexture(startBtnBase);
    this.textures.set("startBtnBase", startBtnBaseTexture);

    //creating gameOver
    const gameOverTexture = await PIXI.Assets.load("gameOver.png");
    this.textures.set("gameOver", gameOverTexture);

    //creating restart
    const restartTexture = await PIXI.Assets.load("restart.png");
    this.textures.set("restart", restartTexture);

    //creating scoreBoard
    const scoreTexture = await PIXI.Assets.load("scoreBoardShort.png");
    this.textures.set("scoreBoard", scoreTexture);
  }

  //get the texture from the map
  getTexture(name: string): PIXI.Texture | undefined {
    return this.textures.get(name);
  }

  //rendering Atlas
  async createSkinAnimation(order: number, adjust: PIXI.Sprite) {
    if (!this.registeredAssets.has("birdAtlas")) {
      PIXI.Assets.add({ alias: "birdAtlas", src: "texture.json" });
      this.registeredAssets.add("birdAtlas");
    }
    await PIXI.Assets.load("birdAtlas");
    const atlas = PIXI.Assets.get("birdAtlas");
    const textures = atlas.textures;
    const birdFrames = [
      textures[`skin${order}-up.png`],
      textures[`skin${order}-down.png`],
    ];
    const bird = new PIXI.AnimatedSprite(birdFrames);
    bird.animationSpeed = 0.15;
    bird.loop = true;
    bird.alpha = 0.5;
    bird.anchor.set(0.5, 0.5);
    bird.width = 100;
    bird.height = 100;
    bird.x = adjust.x + adjust.width / 2;
    bird.y = adjust.y + adjust.height / 2;
    this.utils.grayAnimation(bird);
    return bird;
  }
}
