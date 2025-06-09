import * as PIXI from "pixi.js";
import { helperMethods } from "./helperMethods";
import gsap from "gsap";

export class functionMethods extends helperMethods {
  protected mainContainer: PIXI.Container = new PIXI.Container();
  protected obstaclesContainer: PIXI.Container = new PIXI.Container();
  protected citySprite1!: PIXI.Sprite;
  protected citySprite2!: PIXI.Sprite;
  protected isPlaying: boolean = false;
  private blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter({ strength: 8 });

  protected boundsBird!: any;
  protected boundsUpObstacle!: any;
  protected boundsDownObstacle!: any;

  private loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>;

  protected tapOrClick!: PIXI.Sprite;
  protected tickerBack: PIXI.Ticker = new PIXI.Ticker();
  protected tickerDrop: PIXI.Ticker = new PIXI.Ticker();
  protected tickerObstacles: PIXI.Ticker = new PIXI.Ticker();
  // protected click!: PIXI.Sprite;

  protected gsapMove!: any;

  protected obstacle!: PIXI.Container;
  protected upperTopObstacle!: PIXI.Sprite;
  protected upperBottomObstacle!: PIXI.Sprite;
  protected downTopObstacle!: PIXI.Sprite;
  protected downBottomObstacle!: PIXI.Sprite;
  protected lowerBottomObstacle!: PIXI.Sprite;

  protected app?: PIXI.Application;
  protected graphicsManager: any;
  protected tickerBlur: PIXI.Ticker = new PIXI.Ticker();
  protected chosenAnimation!: PIXI.AnimatedSprite | undefined;

  constructor(
    app: PIXI.Application,
    loadStartBtn: (animation: PIXI.AnimatedSprite) => Promise<void>,
    graphicsManager: any
  ) {
    super();
    this.app = app;
    this.loadStartBtn = loadStartBtn;
    this.graphicsManager = graphicsManager;
  }

  chosenAnimationInit(chosenAnimation: PIXI.AnimatedSprite) {
    this.chosenAnimation = chosenAnimation;
  }

  //loading the main Background
  async loadBackground() {
    const cityTexture: PIXI.Texture = await PIXI.Assets.load(
      "smallSizeCityBackground.webp"
    );
    this.citySprite1 = new PIXI.Sprite(cityTexture);
    this.citySprite2 = new PIXI.Sprite(cityTexture);
    this.evenHeight(this.citySprite1, this.app!.screen);
    this.evenWidth(this.citySprite1, this.app!.screen);
    this.evenHeight(this.citySprite2, this.app!.screen);
    this.evenWidth(this.citySprite2, this.app!.screen);
    this.addPixelBackground();
    this.citySprite1.anchor.set(0);
    this.citySprite2.anchor.set(0);
    this.citySprite1.x = 0;
    this.citySprite2.x = this.citySprite1.width;
  }

  // //choosing skin
  chosenSkin(
    elements: PIXI.Sprite[],
    animations: PIXI.AnimatedSprite[],
    child: PIXI.Container
  ) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].onpointerdown = () => {
        this.removeChild(this.mainContainer, child);
        animations[i].y = this.app!.screen.height / 2 / 2;
        animations[i].x = this.app!.screen.width / 2;
        this.loadStartBtn(animations[i]);
        return animations[i];
      };
    }
  }

  addPixelBackground() {
    this.citySprite1.filters = [this.blurFilter];
  }

  removePixelBackground() {
    this.tickerBlur.add(() => {
      if (this.blurFilter.strength > 0) {
        this.blurFilter.strength -= 0.1;
      } else {
        this.citySprite1.filters = [];
        this.tickerBlur.stop();
      }
    });
    this.tickerBlur.start();
  }

  //click Start button

  clickStartBtn(
    element: PIXI.Sprite,
    animation: PIXI.AnimatedSprite,
    child: PIXI.Container
  ) {
    element.onpointerdown = () => {
      this.removePixelBackground(), this.removeChild(this.mainContainer, child);

      gsap.to(animation, {
        x: this.app!.screen.width + animation.width,
        duration: 0.1, //2
        ease: "power1.inOut",
        onComplete: () => {
          animation.width = animation.width / 2;
          animation.height = animation.height / 2;
          this.startingPositionBird(animation);
        },
      });
    };
  }

  //background Starts moving once clicked
  moveBackground() {
    this.citySprite1.eventMode = this.citySprite2.eventMode = "static";
    this.citySprite1.cursor = this.citySprite2.cursor = "pointer";

    this.tickerBack = new PIXI.Ticker(); // Reset the ticker
    const tickerStarStop = (element: PIXI.Sprite) => {
      element.onpointerdown = () => {
        this.tickerBack.start();
        this.moveObstacles();
        this.isPlaying = true;
        this.dropBird();
      };
    };

    this.tickerBack.add(() => {
      this.citySprite1.x -= 1;
      this.citySprite2.x -= 1;

      if (this.citySprite1.x + this.citySprite1.width <= 0) {
        this.citySprite1.x = this.citySprite2.x + this.citySprite2.width;
      }

      if (this.citySprite2.x + this.citySprite2.width <= 0) {
        this.citySprite2.x = this.citySprite1.x + this.citySprite1.width;
      }
    });

    tickerStarStop(this.citySprite1);
    tickerStarStop(this.citySprite2);
  }

  //dropping bird
  dropBird() {
    this.tickerDrop = new PIXI.Ticker();

    this.tickerDrop.add(() => {
      this.chosenAnimation!.y += 3;

      if (
        this.chosenAnimation!.y >=
        this.app!.screen.height - this.chosenAnimation!.height / 2
      ) {
        this.restartGame();
      }
    });

    this.tickerDrop.start();

    this.chosenAnimation?.gotoAndStop(0);

    const birdUp = (element: PIXI.Sprite) => {
      element.onpointerdown = () => {
        gsap.to(this.chosenAnimation!, {
          y: () => {
            return this.chosenAnimation!.y <= this.chosenAnimation!.height
              ? this.chosenAnimation!.height / 2
              : this.chosenAnimation!.y - 50;
          },
          duration: 0.3,
        });
        this.chosenAnimation!.gotoAndStop(1);
      };
      element.onpointerup = () => {
        this.chosenAnimation!.gotoAndStop(0);
      };
    };

    birdUp(this.citySprite1);
    birdUp(this.citySprite2);
  }

  restartGame() {
    this.isPlaying = false;
    this.citySprite1.x = 0;
    this.citySprite2.x = this.citySprite1.width;
    this.startingPositionBird(this.chosenAnimation!);
    this.chosenAnimation!.play();
    this.tickerBack.stop();
    this.tickerDrop.stop();
    this.tickerObstacles.stop();
    this.obstaclesContainer.removeChildren();
  }

  startingPositionBird(animation: PIXI.AnimatedSprite) {
    gsap.fromTo(
      animation,
      { x: 0, y: this.app!.screen.height / 2 / 2 },
      {
        x: animation.width * 2,
        duration: 0.1, //0.5
        onComplete: () => {
          this.moveBackground();
        },
      }
    );
  }

  async renderObstacles() {
    this.obstacle = new PIXI.Container();

    let upperContainer = new PIXI.Container();
    let downContainer = new PIXI.Container();

    const pipeTopTexture = await PIXI.Assets.load("pipe-up.png");
    const pipeBottomTexture = await PIXI.Assets.load("pipe-down.png");

    this.upperTopObstacle = new PIXI.Sprite(pipeTopTexture);
    this.upperBottomObstacle = new PIXI.Sprite(pipeBottomTexture);

    this.upperTopObstacle.height = 20;
    this.upperTopObstacle.width = 100;

    this.upperBottomObstacle.height =
      Math.random() * Math.floor(this.app!.screen.height) -
      150 -
      this.upperTopObstacle.height;
    this.upperBottomObstacle.width = 100;

    this.upperBottomObstacle.y = 0;
    this.upperTopObstacle.y = this.upperBottomObstacle.height;

    this.downTopObstacle = new PIXI.Sprite(pipeTopTexture);
    this.downBottomObstacle = new PIXI.Sprite(pipeBottomTexture);

    this.downTopObstacle.height = 20;
    this.downTopObstacle.width = 100;

    this.downBottomObstacle.height =
      this.app!.screen.height - this.upperBottomObstacle.height - 150;
    this.downBottomObstacle.width = 100;

    this.downTopObstacle.y =
      this.app!.screen.height - this.downBottomObstacle.height;
    this.downBottomObstacle.y =
      this.app!.screen.height - this.downBottomObstacle.height;

    upperContainer.addChild(this.upperBottomObstacle);
    upperContainer.addChild(this.upperTopObstacle);
    downContainer.addChild(this.downBottomObstacle);
    downContainer.addChild(this.downTopObstacle);

    return [upperContainer, downContainer];
  }

  async moveObstacles() {
    this.tickerObstacles = new PIXI.Ticker();
    let obArr: PIXI.Container[] = [];
    let obstacleEls: any;
    let elapsed = 0;
    this.tickerObstacles.add(async (ticker) => {
      elapsed += ticker.deltaTime / 60;

      if (obArr[0] && this.chosenAnimation!.x - obArr[0].width > obArr[0].x) {
        obArr.shift();
      }

      if (obArr[0]) {
        this.boundsUpObstacle = obArr[0].children[0].getBounds();
        this.boundsDownObstacle = obArr[0].children[1].getBounds();
        this.boundsBird = this.chosenAnimation!.getBounds();

        // if (
        //   this.boundsUpObstacle.x < this.boundsBird.x + this.boundsBird.width &&
        //   this.boundsUpObstacle.x + this.boundsBird.width > this.boundsBird.x &&
        //   this.boundsUpObstacle.x <
        //     this.boundsBird.x + this.boundsBird.height &&
        //   this.boundsUpObstacle.y + this.boundsUpObstacle.height >
        //     this.boundsBird.y
        // ) {
        //   console.log("oops");
        // }
        if (
          this.boundsDownObstacle.x <
            this.boundsBird.x + this.boundsBird.width &&
          this.boundsDownObstacle.x + this.boundsBird.width >
            this.boundsBird.x &&
          this.boundsDownObstacle.x <
            this.boundsBird.x + this.boundsBird.height &&
          this.boundsDownObstacle.y + this.boundsDownObstacle.height >
            this.boundsBird.y
        ) {
        }
      }

      if (elapsed >= 2) {
        elapsed = 0;
        let singleObstaclesContainer = new PIXI.Container();
        obstacleEls = await this.renderObstacles();

        this.addChildrenToContainer(singleObstaclesContainer, obstacleEls);
        obArr.push(singleObstaclesContainer);
        this.obstaclesContainer.addChild(singleObstaclesContainer);

        this.mainContainer.addChild(this.obstaclesContainer);
        singleObstaclesContainer.x = this.app!.screen.width;
        gsap.to(singleObstaclesContainer, {
          x: -singleObstaclesContainer.width,
          duration: 10, //0.5
          ease: "none",
          onComplete: () => {
            this.mainContainer.removeChild(singleObstaclesContainer);
          },
        });
      }
    });

    this.tickerObstacles.start();
  }
}
