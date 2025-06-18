import * as PIXI from "pixi.js";
import gsap from "gsap";
export class gsapFunctions {
  private app!: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  //animation of the bird after clicking START
  startingBirdAnimation(
    animation: PIXI.AnimatedSprite,
    moveBackground: () => void,
    score: PIXI.Container
  ) {
    gsap.to(animation, {
      x: this.app!.screen.width + animation.width,
      duration: 2, //2
      ease: "power1.inOut",
      onComplete: () => {
        animation.width = animation.width / 2;
        animation.height = animation.height / 2;
        this.startingPositionBird(animation, moveBackground);
        this.scoreBoardDown(score);
      },
    });
  }

  //restart the bird position
  startingPositionBird(
    animation: PIXI.AnimatedSprite,
    moveBackground: () => void
  ) {
    gsap.fromTo(
      animation,
      { x: 0, y: this.app!.screen.height / 2 / 2 },
      {
        x: animation.width * 2,
        duration: 1, //1
        onComplete: () => {
          moveBackground();
        },
      }
    );
  }

  birdUpGsap(animation: PIXI.AnimatedSprite) {
    gsap.to(animation, {
      y: () => {
        return animation.y <= animation.height
          ? animation.height / 2
          : animation.y - 50;
      },
      duration: 0.3,
    });
  }

  moveObstacle(el: PIXI.Container, parent: PIXI.Container) {
    gsap.to(el, {
      x: -el.width,
      duration: 10, //0.5
      ease: "none",
      onComplete: () => {
        parent.removeChild(el);
      },
    });
  }

  animateBirdHit(
    el: PIXI.AnimatedSprite,
    showWinPanel: () => void,
    showGameOver: () => void
  ) {
    gsap.to(el, {
      alpha: 0,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        console.log("before game");
        showWinPanel();
        showGameOver();
        console.log("before win panel");
      },
    });
  }

  animateGameOver(
    el: PIXI.Sprite,
    endWidth: number,
    endHeight: number,
    showRestart: () => void
  ) {
    gsap.to(el, {
      width: endWidth,
      height: endHeight,
      x: (this.app.screen.width - endWidth) / 2,
      duration: 0.5,
      onComplete: () => {
        showRestart();
        console.log("gameover done");
      },
    });
  }

  animateRestartBtn(el: PIXI.Sprite) {
    gsap.to(el, {
      height: 100,
      width: 100,
      duration: 0.5,
      x: this.app.screen.width / 2 - 50,
      y: this.app.screen.height / 2 + this.app.screen.height / 4,
    });
  }

  scoreBoardDown(el: PIXI.Container) {
    gsap.to(el, {
      y: 0,
      duration: 1,
      ease: "none",
    });
  }

  scoreBoardUp(el: PIXI.Container) {
    gsap.to(el, {
      y: -el.height,
      duration: 1,
      ease: "none",
    });
  }

  animateWinPanel(winPanel: PIXI.Container) {
    gsap.to(winPanel, {
      y: winPanel.height,
      duration: 1,
      ease: "none",
    });
  }
}
