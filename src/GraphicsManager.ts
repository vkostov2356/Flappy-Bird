import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";

export class GraphicsManager extends helperMethods {
  private app: PIXI.Application;
  private textures: Map<string, PIXI.Texture> = new Map();
  private btnBack1: PIXI.Sprite;
  private btnBack2: PIXI.Sprite;
  private btnBack3: PIXI.Sprite;
  protected registeredAssets: Set<string> = new Set();

  constructor(
    app: PIXI.Application,
    btnBack1: PIXI.Sprite,
    btnBack2: PIXI.Sprite,
    btnBack3: PIXI.Sprite
  ) {
    super();
    this.app = app;
    this.btnBack1 = btnBack1;
    this.btnBack2 = btnBack2;
    this.btnBack3 = btnBack3;
    this.createTextures();
  }

  private createTextures() {
    //create background of the chooseSkin buttons
    const skinBase = this.createRoundedBackground(
      "rgb(255, 255, 255)",
      0,
      0,
      150,
      150,
      10,
      0.8
    );
    skinBase.stroke({ width: 5, color: "#F79370", alpha: 1 });
    const skinBaseTexture = this.app.renderer.generateTexture(skinBase);
    // const skinBaseSprite = new PIXI.Sprite(skinBaseTexture);
    this.textures.set("skinBase", skinBaseTexture);
  }

  //get the texture from the map
  getTexture(name: string): PIXI.Texture | undefined {
    return this.textures.get(name);
  }

  //create sprite from texture
  createSprite(name: string) {
    let texture: PIXI.Texture | undefined = this.getTexture(name);
    if (!texture) throw new Error(`Texture '${name}' not found`);
    const newSprite = new PIXI.Sprite(texture);
    newSprite.eventMode = "static";
    newSprite.cursor = "pointer";
    return newSprite;
  }

  async createSkinAnimation(
    order: number,
    // frame1: string,
    // frame2: string,
    adjust: PIXI.Sprite
  ) {
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
    this.grayAnimation(bird);
    return bird;
  }
}
