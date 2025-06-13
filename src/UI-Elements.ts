import * as PIXI from "pixi.js";
import gsap from "gsap";
import { GraphicsManager } from "./GraphicsManager";
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
  protected skinChoices: PIXI.Container = new PIXI.Container();
  protected backImgs = [] as unknown as [PIXI.Sprite, PIXI.Sprite];
  protected charBtnBacks = [] as unknown as [
    PIXI.Sprite,
    PIXI.Sprite,
    PIXI.Sprite
  ];
  protected skins = [] as unknown as [
    PIXI.AnimatedSprite,
    PIXI.AnimatedSprite,
    PIXI.AnimatedSprite
  ];
  protected startContainer!: PIXI.Container;
  protected startBtnBack!: PIXI.Sprite;
  protected startText!: PIXI.Text;

  protected obstaclesTop = [] as unknown as [PIXI.Sprite, PIXI.Sprite]; //0 - head, 1 - body
  protected obstaclesBottom = [] as unknown as [PIXI.Sprite, PIXI.Sprite]; //0 - head, 1 - body
  protected singleObstacleContainer!: PIXI.Container;
  protected obstaclesContainer!: PIXI.Container;

  protected scoreContainer!: PIXI.Container;
  protected scoreBoard!: PIXI.Sprite;
  protected scoreText!: PIXI.Text;
  protected scoreResult!: PIXI.Text;
  protected bestScore: number = 0;
  protected score: number = 0;
  protected scoreBoardBase!: PIXI.Sprite;
  protected scoreMedal!: PIXI.Sprite;

  protected winPanel!: PIXI.Container;
  protected endBestScoreText!: PIXI.Text;
  protected endBestScoreNumber!: PIXI.Text;
  protected endScoreText!: PIXI.Text;
  protected endScoreNumber!: PIXI.Text;
  protected winPanelTexts = [] as unknown as PIXI.Text[];
  protected newSticker!: PIXI.Sprite;
  protected medalText!: PIXI.Text;
  protected medalAnimation!: PIXI.Sprite;

  protected gameOverSprite!: PIXI.Sprite;
  protected gameRestartSprite!: PIXI.Sprite;

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
    this.loadScoreBord();
  }

  ////////////////BACKGROUND//////////////////////////
  //loadBackground pictures
  async loadBackground() {
    const cityTexture: PIXI.Texture = await PIXI.Assets.load(
      "smallSizeCityBackground.webp"
    );

    for (let i = 0; i < 2; i++) {
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
      this.backImgs[0].x = this.backImgs[1].x + this.backImgs[1].width - 2;
    }

    if (this.backImgs[1].x + this.backImgs[1].width <= 0) {
      this.backImgs[1].x = this.backImgs[0].x + this.backImgs[0].width - 2;
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
    for (let i = 0; i < 3; i++) {
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
    this.utils.addChildrenToContainer(this.skinChoices, this.charBtnBacks);
    this.skinChoices.x = 0;
    this.skinChoices.y =
      this.app.screen.height / 2 - this.charBtnBacks[0].height / 2;

    this.loadBirds();
  }

  //resnder the skins for the player to choose
  async loadBirds() {
    for (let i = 0; i < 3; i++) {
      this.skins[i] = await this.graphicsManager.createSkinAnimation(
        i + 1,
        this.charBtnBacks[i]
      );
    }

    this.utils.addChildrenToContainer(this.skinChoices, this.skins);
    this.utils.startAnimation(this.charBtnBacks, this.skins);
    this.utils.stopAnimation(this.charBtnBacks, this.skins);
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
        this.gameOver();
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

    birdUp(this.backImgs[0]);
    birdUp(this.backImgs[1]);
  }

  ////////////////START BUTTON//////////////////////////

  async loadStartBtn() {
    await this.createStartBtn();

    this.utils.addChildrenToContainer(this.mainContainer, [
      this.startContainer,
      this.chosenCharacter,
    ]);
  }

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

  clickStartBtn() {
    this.utils.removePixelBackground(
      this.graphicsManager.backgroundTicker,
      this.graphicsManager.blurFilter,
      this.backImgs[0]
    ),
      this.utils.removeChild(this.mainContainer, this.startContainer);
    this.gsap.startingBirdAnimation(
      this.chosenCharacter,
      this.moveBackground.bind(this),
      this.scoreContainer
    );
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
    this.obstaclesBottom[1] = new PIXI.Sprite(pipeHeadTexture);
    this.obstaclesBottom[0] = new PIXI.Sprite(pipeBodyTexture);

    this.obstaclesBottom[1].height = 20;
    this.obstaclesBottom[1].width = 100;

    this.obstaclesBottom[0].height =
      this.app!.screen.height - this.obstaclesTop[1].height - 150;
    this.obstaclesBottom[0].width = 100;

    this.obstaclesBottom[1].y =
      this.app!.screen.height - this.obstaclesBottom[0].height;
    this.obstaclesBottom[0].y =
      this.app!.screen.height - this.obstaclesBottom[0].height;

    this.utils.addChildrenToContainer(bottomObstacle, [
      ...this.obstaclesBottom,
    ]);

    return [topObstacle, bottomObstacle];
  }

  //moving animation for obstacles
  async moveObstacles() {
    this.obstaclesContainer = this.graphicsManager.createContainer();
    this.mainContainer.addChild(this.obstaclesContainer);
    this.graphicsManager.obstaclesTicker = this.graphicsManager.createTicker();
    let obstacles: PIXI.Container[] = [];
    let elapsed = 0;

    this.graphicsManager.obstaclesTicker.add(async (ticker) => {
      elapsed += ticker.deltaTime / 60;
      if (obstacles[0]) {
        this.collisionDetection(this.chosenCharacter, obstacles[0].children);
        if (this.chosenCharacter.x >= obstacles[0].x + obstacles[0].width) {
          this.score += 1;
          this.updateScore(this.score);
        }
      }
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

        this.singleObstacleContainer.x = this.app!.screen.width;
        this.gsap.moveObstacle(
          this.singleObstacleContainer,
          this.mainContainer
        );
      }
    });

    this.graphicsManager.obstaclesTicker.start();
  }

  ////////////////SCORE//////////////////////////

  //rendering score board
  async loadScoreBord() {
    this.scoreContainer = this.graphicsManager.createContainer();
    this.scoreBoard = this.graphicsManager.createSprite("scoreBoard");
    this.scoreBoard.width = this.app.screen.width / 10;
    this.scoreBoard.height = this.app.screen.height / 6;
    this.scoreContainer.addChild(this.scoreBoard);
    this.scoreContainer.x =
      this.app.screen.width - this.scoreContainer.width * 1.5;
    this.scoreContainer.y = -this.scoreBoard.height;
    this.scoreContainer.zIndex = 90;
    this.mainContainer.addChild(this.scoreContainer);
    this.loadScore();
  }

  //rendering score
  loadScore() {
    this.scoreText = this.graphicsManager.createText(
      "Score",
      20,
      "rgb(255, 255, 255)"
    );
    this.scoreText.x = this.scoreBoard.width / 2 - this.scoreText.width / 2;
    this.scoreText.y = this.scoreBoard.height / 2.5;
    this.updateScore(this.score);
    this.scoreContainer.addChild(this.scoreText);
  }

  updateScore(score: number) {
    this.scoreContainer.removeChild(this.scoreResult);
    this.scoreResult = this.graphicsManager.createText(
      `${score}`,
      20,
      "rgb(255, 255, 255)"
    );
    this.scoreResult.x = this.scoreBoard.width / 2 - this.scoreResult.width / 2;
    this.scoreResult.y = this.scoreBoard.height / 1.4;
    this.scoreContainer.addChild(this.scoreResult);
  }

  //collision check
  collisionDetection(
    el: PIXI.AnimatedSprite,
    obstacles: PIXI.ContainerChild[]
  ) {
    const elBounds = el.getBounds();
    const obstacleTop = obstacles[0].getBounds();
    const obstacleBot = obstacles[1].getBounds();

    if (
      elBounds.x < obstacleTop.x + obstacleTop.width &&
      elBounds.x + elBounds.width > obstacleTop.x &&
      elBounds.y < obstacleTop.y + obstacleTop.height &&
      elBounds.y + elBounds.height > obstacleTop.y
    ) {
      this.gameOver();
    } else if (
      elBounds.x < obstacleBot.x + obstacleBot.width &&
      elBounds.x + elBounds.width > obstacleBot.x &&
      elBounds.y < obstacleBot.y + obstacleBot.height &&
      elBounds.y + elBounds.height > obstacleBot.y
    ) {
      this.gameOver();
    }
  }

  //loading win panel
  loadWinPanel() {
    this.winPanel = this.graphicsManager.createContainer();

    this.scoreBoardBase = this.graphicsManager.createSprite("winPanel");
    this.winPanel.eventMode = "none";
    this.winPanel.addChild(this.scoreBoardBase);
    this.utils.centerElement(this.app.screen, this.winPanel);
    this.mainContainer.addChild(this.winPanel);
    this.loadingFinalScores();
  }

  loadingFinalScores() {
    const xEl = this.winPanel.x - this.winPanel.width / 2;
    const hEl = this.winPanel.height / 7;
    const newBest = this.bestScore < this.score;

    this.endBestScoreText = this.graphicsManager.createText(
      `BEST SCORE`,
      30,
      " #FCA048"
    );

    this.endBestScoreText.height = hEl;

    this.endBestScoreText.x = xEl;
    this.endBestScoreText.y = this.winPanel.height / 6;

    this.endBestScoreNumber = this.graphicsManager.createText(
      `${newBest ? this.score : this.bestScore}`,
      30,
      " #FCA048"
    );

    this.endBestScoreNumber.x = xEl;
    this.endBestScoreNumber.y =
      this.endBestScoreText.y + this.endBestScoreNumber.height;

    this.endScoreText = this.graphicsManager.createText(
      "SCORE",
      30,
      " #FCA048"
    );
    this.endScoreText.x = xEl;
    this.endScoreText.y = this.endBestScoreNumber.y + this.endScoreText.height;

    this.endScoreNumber = this.graphicsManager.createText(
      `${this.score}`,
      30,
      " #FCA048"
    );
    this.endScoreNumber.x = xEl;
    this.endScoreNumber.y = this.endScoreText.y + this.endScoreNumber.height;

    if (this.bestScore < this.score) {
      this.bestScore = this.score;
    } else {
      this.utils.grayAnimation(this.endBestScoreText);
      this.utils.grayAnimation(this.endBestScoreNumber);
    }

    this.utils.addChildrenToContainer(this.winPanel, [
      this.endBestScoreText,
      this.endBestScoreNumber,
      this.endScoreText,
      this.endScoreNumber,
    ]);

    if (newBest) {
      this.newSticker = this.graphicsManager.createSprite("newSticker");
      this.newSticker.height = hEl * 1.5;
      this.newSticker.width = hEl * 1.5;

      this.newSticker.x = this.endBestScoreText.x - this.newSticker.width / 2;
      this.newSticker.y = this.endBestScoreText.y - this.newSticker.height / 2;
      this.winPanel.addChild(this.newSticker);
    } else {
      this.winPanel.removeChild(this.newSticker);
    }
  }

  ////////////////END OF GAME//////////////////////////

  gameOver() {
    this.gameOverSprite = this.graphicsManager.createSprite("gameOver");
    gsap.globalTimeline.clear();
    this.gsap.scoreBoardUp(this.scoreContainer);

    this.backImgs[0].eventMode = this.backImgs[1].eventMode = "none";

    this.graphicsManager.backgroundTicker.stop();
    this.graphicsManager.birdDropTicker.stop();
    this.graphicsManager.obstaclesTicker.stop();
    this.gsap.animateBirdHit(
      this.chosenCharacter,
      this.showGameOver.bind(this)
    );
    this.loadWinPanel();
  }

  showGameOver() {
    const startWidth = this.app.screen.width / 10;
    const startHeight = this.app.screen.height / 10;
    const endWidth = this.app.screen.width / 3;
    const endHeight = this.app.screen.height / 4;
    console.log(this.winPanel.y);

    this.gameOverSprite.eventMode = "none";
    this.gameOverSprite.width = startWidth;
    this.gameOverSprite.height = startHeight;
    this.gameOverSprite.x = (this.app.screen.width - startWidth) / 2;
    this.gameOverSprite.y = this.winPanel.y - endHeight;
    this.mainContainer.addChild(this.gameOverSprite);

    this.gsap.animateGameOver(
      this.gameOverSprite,
      endWidth,
      endHeight,
      this.showRestartBtn.bind(this)
    );
  }

  showRestartBtn() {
    this.gameRestartSprite = this.graphicsManager.createSprite("restart");

    this.gameRestartSprite.width = 10;
    this.gameRestartSprite.height = 10;
    this.gameRestartSprite.x = this.app.screen.width / 2;
    this.gameRestartSprite.y =
      this.app.screen.height / 2 + this.app.screen.height / 2 / 2;

    this.mainContainer.addChild(this.gameRestartSprite);
    this.gsap.animateRestartBtn(this.gameRestartSprite);

    this.gameRestartSprite.onpointerover = () => {
      this.gameRestartSprite.height = this.gameRestartSprite.width += 10;
    };
    this.gameRestartSprite.onpointerout = () => {
      this.gameRestartSprite.height = this.gameRestartSprite.width -= 10;
    };
    this.gameRestartSprite.onpointerdown = () => {
      this.restartBtnAction();
    };
  }

  restartBtnAction() {
    // this.functionMethod.isPlaying = false;
    this.backImgs[0].x = 0;
    this.backImgs[1].x = this.backImgs[0].width;
    this.chosenCharacter.play();
    console.log(this.obstaclesContainer);

    this.obstaclesContainer.removeChildren();
    console.log(this.obstaclesContainer);
    this.scoreBoard;
    this.scoreContainer.y = -this.scoreContainer.height;
    this.gsap.startingPositionBird(this.chosenCharacter, () =>
      this.moveBackground()
    );
    this.gsap.scoreBoardDown(this.scoreContainer);
    this.mainContainer.removeChild(this.gameOverSprite);
    this.mainContainer.removeChild(this.gameRestartSprite);
    this.winPanel.removeChildren();
    this.score = 0;
    this.updateScore(this.score);
  }
}
