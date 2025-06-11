import * as PIXI from "pixi.js";
import { GraphicsManager } from "./GraphicsManager1";
import { utils } from "./utils";
import { gsapFunctions } from "./gsapFunctions";

export class UIElements {
  //initialization
  private app: PIXI.Application;
  private graphicsManager: GraphicsManager;
  private utils: utils;
  private gsap: gsapFunctions;
  protected mainContainer: PIXI.Container;

  //UI elements
  protected skinChoices!: PIXI.Container;
  protected backImgs!: [PIXI.Sprite, PIXI.Sprite];
  protected charBtnBacks!: [PIXI.Sprite, PIXI.Sprite, PIXI.Sprite];
  protected skins!: [
    PIXI.AnimatedSprite,
    PIXI.AnimatedSprite,
    PIXI.AnimatedSprite
  ];
  protected startContainer!: PIXI.Container;
  protected startBtnBack!: PIXI.Sprite;
  protected startText!: PIXI.Text;

  protected obstaclesTop!: [PIXI.Sprite, PIXI.Sprite]; //0 - head, 1 - body
  protected obstaclesBottom!: [PIXI.Sprite, PIXI.Sprite]; //0 - head, 1 - body
  protected singleObstacleContainer!: PIXI.Container;
  protected obstaclesContainer!: PIXI.Container;

  protected gameOverSprite!: PIXI.Sprite;

  //chosen character
  protected chosenCharacter!: PIXI.AnimatedSprite; //last name chosenAnimation

  constructor(
    app: PIXI.Application,
    utils: utils,
    graphicsManager: GraphicsManager,
    gsapFunctions: gsapFunctions,
    mainContainer: PIXI.Container
  ) {
    this.app = app;
    this.utils = utils;
    this.graphicsManager = graphicsManager;
    this.gsap = gsapFunctions;
    this.mainContainer = mainContainer;
    this.loadUIElements();
  }
  ////////////////LOAD UI Elements//////////////////////////
  async loadUIElements() {
    await this.loadBackground();
    await this.loadCharacters();
    this.utils.addChildrenToContainer(this.mainContainer, [
      this.backImgs[0],
      this.backImgs[1],
      this.skinChoices,
    ]);
  }

  ////////////////BACKGROUND//////////////////////////
  //loadBackground pictures
  async loadBackground() {
    const cityTexture: PIXI.Texture = await PIXI.Assets.load(
      "smallSizeCityBackground.webp"
    );

    for (let i = 0; i < this.backImgs.length; i++) {
      this.backImgs[i] = new PIXI.Sprite(cityTexture);
      this.utils.evenHeight(this.backImgs[i], this.app!.screen);
      this.utils.evenWidth(this.backImgs[i], this.app!.screen);
      this.backImgs[i].filters = [this.graphicsManager.blurFilter];
      this.backImgs[i].anchor.set(0);
      this.backImgs[i].x = i == 0 ? 0 : this.backImgs[0].width;
    }
  }

  //seemless transition for the moving background
  restartBackground() {
    this.backImgs[0].x -= 1;
    this.backImgs[1].x -= 1;

    if (this.backImgs[0].x + this.backImgs[0].width <= 0) {
      this.backImgs[0].x = this.backImgs[1].x + this.backImgs[1].width;
    }

    if (this.backImgs[1].x + this.backImgs[1].width <= 0) {
      this.backImgs[1].x = this.backImgs[0].x + this.backImgs[0].width;
    }
  }

  //moving the background
  moveBackground() {
    this.backImgs[0].eventMode = this.backImgs[1].eventMode = "static";
    this.backImgs[0].cursor = this.backImgs[1].cursor = "pointer";

    this.graphicsManager.backgroundTicker = this.graphicsManager.createTicker(); // Reset the ticker
    const tickerStarStop = (element: PIXI.Sprite) => {
      element.onpointerdown = () => {
        this.graphicsManager.backgroundTicker.start();
        this.moveObstacles();
        this.dropBird();
      };
    };
    this.graphicsManager.backgroundTicker.add(() => {
      this.restartBackground();
    });

    tickerStarStop(this.backImgs[0]);
    tickerStarStop(this.backImgs[1]);
  }

  ////////////////BIRDS//////////////////////////

  //create the bases of the choose character state
  async loadCharacters() {
    for (let i = 0; i < this.charBtnBacks.length; i++) {
      this.charBtnBacks[i] = this.graphicsManager.createSprite("skinBase");
      this.charBtnBacks[i].onpointerdown = () => {
        this.chooseCharacter(i);
      };
    }
    this.charBtnBacks[0].x =
      this.app.screen.width / 2 - this.charBtnBacks[0].width * 2;
    this.charBtnBacks[1].x =
      this.app.screen.width / 2 - this.charBtnBacks[1].width / 2;
    this.charBtnBacks[2].x =
      this.app.screen.width / 2 + this.charBtnBacks[2].width;

    this.utils.addChildrenToContainer(this.skinChoices, [...this.charBtnBacks]);
    this.utils.centerElement(this.app.screen, this.skinChoices);

    this.loadBirds();
  }

  //resnder the skins for the player to choose
  async loadBirds() {
    for (let i = 0; i < this.skins.length; i++) {
      this.skins[i] = await this.graphicsManager.createSkinAnimation(
        i + 1,
        this.charBtnBacks[0]
      );
    }
    this.utils.addChildrenToContainer(this.skinChoices, [...this.skins]);
  }

  //set the chosen animation
  chooseCharacter(i: number) {
    this.utils.removeChild(this.mainContainer, this.skinChoices);
    this.skins[i].x = this.app!.screen.width / 2;
    this.skins[i].y = this.app!.screen.height / 2 / 2;
    this.loadStartBtn();
    this.chosenCharacter = this.skins[i];
  }

  //dropping bird
  dropBird() {
    this.graphicsManager.birdDropTicker = this.graphicsManager.createTicker();

    this.graphicsManager.birdDropTicker.add(() => {
      this.chosenCharacter.y += 3;

      if (
        this.chosenCharacter.y >=
        this.app!.screen.height - this.chosenCharacter.height / 2
      ) {
        this
          .gameOver
          // this.tickerBack,
          ();
      }
    });

    this.graphicsManager.birdDropTicker.start();

    this.chosenCharacter.gotoAndStop(0);

    const birdUp = (element: PIXI.Sprite) => {
      element.onpointerdown = () => {
        this.gsap.birdUpGsap(this.chosenCharacter);
        this.chosenCharacter.gotoAndStop(1);
      };
      element.onpointerup = () => {
        this.chosenCharacter.gotoAndStop(0);
      };
    };

    birdUp(this.skins[0]);
    birdUp(this.skins[1]);
  }

  ////////////////START BUTTON//////////////////////////

  //create start Button
  async createStartBtn() {
    this.startContainer = this.graphicsManager.createContainer();
    this.startBtnBack = this.graphicsManager.createSprite("startBtnBase");
    this.startBtnBack.onpointerdown = () => {
      this.clickStartBtn();
    };
    this.startText = this.graphicsManager.createText("START", 25, "#000000");
    this.utils.hoverScale([this.startBtnBack, this.startText], this.app.screen);
    this.utils.centerElement(this.app.screen, this.startText);
    this.utils.centerElement(this.app.screen, this.startBtnBack);

    this.utils.addChildrenToContainer(this.startContainer, [
      this.startBtnBack,
      this.startText,
    ]);
  }

  async loadStartBtn() {
    await this.createStartBtn();

    this.utils.addChildrenToContainer(this.mainContainer, [
      this.startContainer,
      this.chosenCharacter,
    ]);
  }

  clickStartBtn() {
    this.utils.removePixelBackground(
      this.graphicsManager.backgroundTicker,
      this.graphicsManager.blurFilter,
      this.backImgs[0]
    ),
      this.utils.removeChild(this.mainContainer, this.startContainer);

    this.gsap.startingBirdAnimation(this.chosenCharacter, this.moveBackground);
  }

  ////////////////OBSTACLES//////////////////////////

  //creating the obstacles and setting their dimensions
  async renderObstacles() {
    let topObstacle = new PIXI.Container();
    let bottomObstacle = new PIXI.Container();

    const pipeHeadTexture = await PIXI.Assets.load("pipe-up.png");
    const pipeBodyTexture = await PIXI.Assets.load("pipe-down.png");

    //creating top obstacles
    this.obstaclesTop[0] = new PIXI.Sprite(pipeHeadTexture);
    this.obstaclesTop[1] = new PIXI.Sprite(pipeBodyTexture);

    this.obstaclesTop[0].height = 20;
    this.obstaclesTop[0].width = 100;

    //creating the math for rendering different hight obstacles
    const minHeight = 50;
    const maxPipeHeight =
      this.app.screen.height - 150 - this.obstaclesTop[0].height;
    const randomHeight = Math.max(minHeight, Math.random() * maxPipeHeight);

    this.obstaclesTop[1].height = randomHeight;
    this.obstaclesTop[1].width = 100;

    this.obstaclesTop[1].y = 0;
    this.obstaclesTop[0].y = this.obstaclesTop[1].height;

    this.utils.addChildrenToContainer(topObstacle, [...this.obstaclesTop]);

    //creating bottom obstacles
    this.obstaclesBottom[0] = new PIXI.Sprite(pipeHeadTexture);
    this.obstaclesBottom[1] = new PIXI.Sprite(pipeBodyTexture);

    this.obstaclesBottom[0].height = 20;
    this.obstaclesBottom[0].width = 100;

    this.obstaclesBottom[1].height =
      this.app!.screen.height - this.obstaclesTop[1].height - 150;
    this.obstaclesBottom[1].width = 100;

    this.obstaclesBottom[0].y =
      this.app!.screen.height - this.obstaclesBottom[1].height;
    this.obstaclesBottom[1].y =
      this.app!.screen.height - this.obstaclesBottom[1].height;

    this.utils.addChildrenToContainer(bottomObstacle, [
      ...this.obstaclesBottom,
    ]);

    return [topObstacle, bottomObstacle];
  }

  //moving animation for obstacles
  async moveObstacles() {
    this.obstaclesContainer = this.graphicsManager.createContainer();
    this.graphicsManager.obstaclesTicker = this.graphicsManager.createTicker();
    let obstacles: PIXI.Container[] = [];
    let elapsed = 0;
    this.graphicsManager.obstaclesTicker.add(async (ticker) => {
      elapsed += ticker.deltaTime / 60;

      if (
        obstacles[0] &&
        this.chosenCharacter.x - obstacles[0].width > obstacles[0].x
      ) {
        obstacles.shift();
      }

      if (elapsed >= 3) {
        elapsed = 0;
        this.singleObstacleContainer = new PIXI.Container();

        this.utils.addChildrenToContainer(
          this.singleObstacleContainer,
          await this.renderObstacles()
        );

        obstacles.push(this.singleObstacleContainer);
        this.obstaclesContainer.addChild(this.singleObstacleContainer);

        this.mainContainer.addChild(this.obstaclesContainer);
        this.singleObstacleContainer.x = this.app!.screen.width;
        this.gsap.moveObstacle(
          this.singleObstacleContainer,
          this.mainContainer
        );
      }
    });

    this.graphicsManager.obstaclesTicker.start();
  }

  ////////////////END OF GAME//////////////////////////

  gameOver() {
    this.gameOverSprite = this.graphicsManager.createSprite("gameOver");
    gsap.globalTimeline.clear();

    this.backImgs[0].eventMode = this.backImgs[1].eventMode = "none";

    //  this.graphicsManager.backgroundTicker.stop();
    // this.graphicsManager.birdDropTicker.stop();
    // this.graphicsManager.obstaclesTicker.stop();
    this.gsap.animateGameOver(this.chosenCharacter, this.showGameOver);
    // gsap.to(this.chosenCharacter, {
    //   alpha: 0,
    //   duration: 0.1,
    //   repeat: 1,
    //   yoyo: true,
    //   ease: "none",
    //   onComplete: () => {
    //     this.showGameOver(gameOverSprite);
    //   },
    // });
  }

  showGameOver() {
    const startWidth = this.app.screen.width / 10;
    const startHeight = this.app.screen.height / 10;
    const endWidth = this.app.screen.width / 4;
    const endHeight = this.app.screen.height / 4;

    this.gameOverSprite.eventMode = "none";
    this.gameOverSprite.width = startWidth;
    this.gameOverSprite.height = startHeight;
    this.gameOverSprite.x = (this.app.screen.width - startWidth) / 2;
    this.gameOverSprite.y = this.app.screen.height / 2 - startHeight;
    this.mainContainer.addChild(this.gameOverSprite);

    gsap.to(this.gameOverSprite, {
      width: endWidth,
      height: endHeight,
      x: (this.app.screen.width - endWidth) / 2,
      y: this.app.screen.height / 2 - endHeight,
      duration: 0.5,
      onComplete: () => {
        this.showRestartBtn();
      },
    });
  }

  showRestartBtn() {
    const restartBtn = this.graphicsManager.createSprite("restart");

    restartBtn.width = 10;
    restartBtn.height = 10;
    restartBtn.x = this.app.screen.width / 2;
    restartBtn.y = this.app.screen.height / 2 + this.app.screen.height / 2 / 2;

    this.mainContainer.addChild(restartBtn);
    gsap.to(restartBtn, {
      height: 100,
      width: 100,
      duration: 0.5,
      x: this.app.screen.width / 2 - 50,
      y: this.app.screen.height / 2 + this.app.screen.height / 2 / 2,
    });

    restartBtn.onpointerover = () => {
      restartBtn.height = restartBtn.width += 10;
    };
    restartBtn.onpointerout = () => {
      restartBtn.height = restartBtn.width -= 10;
    };
    restartBtn.onpointerdown = () => {
      this.restartBtnAction();
    };
  }

  restartBtnAction() {
    // this.functionMethod.isPlaying = false;
    this.backImgs[0].x = 0;
    this.backImgs[1].x = this.backImgs[0].width;
    this.chosenCharacter.play();
    this.obstaclesContainer.removeChildren();
    this.gsap.startingPositionBird(this.chosenCharacter, () =>
      this.moveBackground()
    );
  }
}
