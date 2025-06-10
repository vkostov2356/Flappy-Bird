import * as PIXI from "pixi.js";
import gsap from "gsap";

export class EndGame {
  private app: PIXI.Application;
  private functionMethod: any;
  private graphicsManager: any;
  private gsapFunctions!: any;

  constructor(
    app: PIXI.Application,
    functionMethod: any,
    graphicsManager: any,
    gsapFunctions: any
  ) {
    this.app = app;
    this.functionMethod = functionMethod;
    this.graphicsManager = graphicsManager;
    this.gsapFunctions = gsapFunctions;
  }

  gameOver(
    restartAnimation: () => void,
    birdDropTicker: PIXI.Ticker,
    obstacleTicker: PIXI.Ticker
  ) {
    const gameOverSprite = this.graphicsManager.createSprite("gameOver");
    gsap.globalTimeline.clear();
    this.functionMethod.tickerBack.stop();
    this.functionMethod.citySprite1.eventMode =
      this.functionMethod.citySprite2.eventMode = "none";

    birdDropTicker.stop();
    obstacleTicker.stop();
    gsap.to(this.functionMethod.chosenAnimation, {
      alpha: 0,
      duration: 0.1,
      repeat: 1,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        console.log("lost");
        this.showGameOver(gameOverSprite, restartAnimation);
      },
    });
  }

  showGameOver(el: PIXI.Sprite, restartAnimation: () => void) {
    const startWidth = this.app.screen.width / 10;
    const startHeight = this.app.screen.height / 10;
    const endWidth = this.app.screen.width / 4;
    const endHeight = this.app.screen.height / 4;

    el.eventMode = "none";
    el.width = startWidth;
    el.height = startHeight;
    el.x = (this.app.screen.width - startWidth) / 2;
    el.y = this.app.screen.height / 2 - startHeight;
    this.functionMethod.mainContainer.addChild(el);
    gsap.to(el, {
      width: endWidth,
      height: endHeight,
      x: (this.app.screen.width - endWidth) / 2,
      y: this.app.screen.height / 2 - endHeight,
      duration: 0.5,
      onComplete: () => {
        this.showRestartBtn(restartAnimation);
      },
    });
  }

  showRestartBtn(restartAnimation: () => void) {
    const restartBtn = this.graphicsManager.createSprite("restart");

    restartBtn.width = 10;
    restartBtn.height = 10;
    restartBtn.x = this.app.screen.width / 2;
    restartBtn.y = this.app.screen.height / 2 + this.app.screen.height / 2 / 2;

    this.functionMethod.mainContainer.addChild(restartBtn);
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
      this.restartBtnAction(restartAnimation);
    };
  }

  restartBtnAction(restartAnimation: () => void) {
    this.functionMethod.isPlaying = false;
    this.functionMethod.citySprite1.x = 0;
    this.functionMethod.citySprite2.x = this.functionMethod.citySprite1.width;
    this.functionMethod.chosenAnimation!.play();
    this.functionMethod.obstaclesContainer.removeChildren();
    restartAnimation();
  }
}
