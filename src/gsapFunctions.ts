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
      duration: 0.1, //2
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
        duration: 0.1, //1
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

  animateGameOver(el: PIXI.AnimatedSprite, showGameOver: () => void) {
    gsap.to(el, {
      alpha: 0,
      duration: 0.1,
      repeat: 1,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        showGameOver();
      },
    });
  }

  animateRestartBtn(
    el: PIXI.Sprite,
    endWidth: number,
    endHeight: number,
    showRestart: () => void
  ) {
    gsap.to(el, {
      width: endWidth,
      height: endHeight,
      x: (this.app.screen.width - endWidth) / 2,
      // y: this.app.screen.height / 2 - endHeight,
      duration: 0.5,
      onComplete: () => {
        showRestart();
      },
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
}
