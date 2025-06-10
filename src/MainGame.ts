import * as PIXI from "pixi.js";
import gsap from "gsap";

export class MainGame {
  private app!: PIXI.Application;
  private functionMethods!: any;
  private graphicsMethods!: any;
  private endGame!: any;
  private gsapFunctions!: any;

  private tickerDrop: PIXI.Ticker = new PIXI.Ticker();
  private tickerObstacles: PIXI.Ticker = new PIXI.Ticker();

  private upperTopObstacle!: PIXI.Sprite;
  private upperBottomObstacle!: PIXI.Sprite;
  private downTopObstacle!: PIXI.Sprite;
  private downBottomObstacle!: PIXI.Sprite;

  constructor(
    app: PIXI.Application,
    functionMethods: any,
    graphicsMethods: any,
    endGame: any,
    gsapFunctions: any
  ) {
    this.app = app;
    this.functionMethods = functionMethods;
    this.graphicsMethods = graphicsMethods;
    this.endGame = endGame;
    this.gsapFunctions = gsapFunctions;
  }

  //background Starts moving once clicked
  // moveBackground() {
  //   this.functionMethods.citySprite1.eventMode =
  //     this.functionMethods.citySprite2.eventMode = "static";
  //   this.functionMethods.citySprite1.cursor =
  //     this.functionMethods.citySprite2.cursor = "pointer";

  //   this.tickerBack = this.graphicsMethods.createTicker(); // Reset the ticker
  //   const tickerStarStop = (element: PIXI.Sprite) => {
  //     element.onpointerdown = () => {
  //       this.tickerBack.start();
  //       this.moveObstacles();
  //       this.functionMethods.isPlaying = true;
  //       this.dropBird();
  //     };
  //   };

  //dropping bird
  dropBird() {
    this.tickerDrop = this.graphicsMethods.createTicker();

    this.tickerDrop.add(() => {
      this.functionMethods.chosenAnimation!.y += 3;

      if (
        this.functionMethods.chosenAnimation!.y >=
        this.app!.screen.height -
          this.functionMethods.chosenAnimation!.height / 2
      ) {
        this.endGame.gameOver(
          () =>
            this.functionMethods.startingPositionBird(
              this.functionMethods.chosenAnimation!,
              () =>
                this.functionMethods.moveBackground(
                  () => this.moveObstacles(),
                  () => this.dropBird()
                )
            ),
          // this.tickerBack,
          this.tickerDrop,
          this.tickerObstacles
        );
      }
    });

    this.tickerDrop.start();

    this.functionMethods.chosenAnimation?.gotoAndStop(0);

    const birdUp = (element: PIXI.Sprite) => {
      element.onpointerdown = () => {
        this.gsapFunctions.birdUpGsap(this.functionMethods.chosenAnimation!);
        this.functionMethods.chosenAnimation!.gotoAndStop(1);
      };
      element.onpointerup = () => {
        this.functionMethods.chosenAnimation!.gotoAndStop(0);
      };
    };

    birdUp(this.functionMethods.citySprite1);
    birdUp(this.functionMethods.citySprite2);
  }

  restartGame() {
    // this.functionMethods.isPlaying = false;
    // this.functionMethods.citySprite1.x = 0;
    // this.functionMethods.citySprite2.x = this.functionMethods.citySprite1.width;
    // this.functionMethods.startingPositionBird(
    //   this.functionMethods.chosenAnimation!,startingPositionBird
    //   () => this.functionMethods.moveBackground(
    //     this.
    //   )
    // );
    // this.functionMethods.chosenAnimation!.play();
    // this.tickerBack.stop();
    // this.tickerDrop.stop();
    // this.tickerObstacles.stop();
    // this.functionMethods.obstaclesContainer.removeChildren();
  }

  clickStartBtn(
    element: PIXI.Sprite,
    animation: PIXI.AnimatedSprite,
    child: PIXI.Container
  ) {
    element.onpointerdown = () => {
      this.functionMethods.removePixelBackground(),
        this.functionMethods.removeChild(
          this.functionMethods.mainContainer,
          child
        );

      gsap.to(animation, {
        x: this.app!.screen.width + animation.width,
        duration: 0.1, //2
        ease: "power1.inOut",
        onComplete: () => {
          animation.width = animation.width / 2;
          animation.height = animation.height / 2;
          this.functionMethods.startingPositionBird(animation, () =>
            this.functionMethods.moveBackground(
              () => this.moveObstacles(),
              () => this.dropBird()
            )
          );
        },
      });
    };
  }

  async renderObstacles() {
    let upperContainer = new PIXI.Container();
    let downContainer = new PIXI.Container();

    const pipeTopTexture = await PIXI.Assets.load("pipe-up.png");
    const pipeBottomTexture = await PIXI.Assets.load("pipe-down.png");

    this.upperTopObstacle = new PIXI.Sprite(pipeTopTexture);
    this.upperBottomObstacle = new PIXI.Sprite(pipeBottomTexture);

    this.upperTopObstacle.height = 20;
    this.upperTopObstacle.width = 100;

    const minHeight = 50; // or whatever minimum makes sense visually
    const maxPipeHeight =
      this.app.screen.height - 150 - this.upperTopObstacle.height;
    const randomHeight = Math.max(minHeight, Math.random() * maxPipeHeight);

    this.upperBottomObstacle.height = randomHeight;

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
    this.tickerObstacles = this.graphicsMethods.createTicker();
    let obArr: PIXI.Container[] = [];
    let obstacleEls: any;
    let elapsed = 0;
    this.tickerObstacles.add(async (ticker) => {
      elapsed += ticker.deltaTime / 60;

      if (
        obArr[0] &&
        this.functionMethods.chosenAnimation!.x - obArr[0].width > obArr[0].x
      ) {
        obArr.shift();
      }

      if (elapsed >= 3) {
        elapsed = 0;
        this.functionMethods.singleObstaclesContainer = new PIXI.Container();
        obstacleEls = await this.renderObstacles();

        this.functionMethods.addChildrenToContainer(
          this.functionMethods.singleObstaclesContainer,
          obstacleEls
        );
        obArr.push(this.functionMethods.singleObstaclesContainer);
        this.functionMethods.obstaclesContainer.addChild(
          this.functionMethods.singleObstaclesContainer
        );

        this.functionMethods.mainContainer.addChild(
          this.functionMethods.obstaclesContainer
        );
        this.functionMethods.singleObstaclesContainer.x =
          this.app!.screen.width;
        gsap.to(this.functionMethods.singleObstaclesContainer, {
          x: -this.functionMethods.singleObstaclesContainer.width,
          duration: 10, //0.5
          ease: "none",
          onComplete: () => {
            this.functionMethods.mainContainer.removeChild(
              this.functionMethods.singleObstaclesContainer
            );
          },
        });
      }
    });

    this.tickerObstacles.start();
  }
}
