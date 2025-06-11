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
    moveBackground?: () => void
  ) {
    console.log("gsap1");
    gsap.to(animation, {
      x: this.app!.screen.width + animation.width,
      duration: 0.1, //2
      ease: "power1.inOut",
      onComplete: () => {
        animation.width = animation.width / 2;
        animation.height = animation.height / 2;
        this.startingPositionBird(animation, moveBackground!);
      },
    });
  }

  //restart the bird position
  startingPositionBird(
    animation: PIXI.AnimatedSprite,
    moveBackground: () => void
  ) {
    console.log("gsap2");
    gsap.fromTo(
      animation,
      { x: 0, y: this.app!.screen.height / 2 / 2 },
      {
        x: animation.width * 2,
        duration: 0.1, //1
        onComplete: () => {
          console.log("gsap 2 done");
          moveBackground();
        },
      }
    );
  }

  birdUpGsap(animation: PIXI.AnimatedSprite) {
    console.log("gsap3");
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
    console.log("gsap4");
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
    console.log("gsap5");
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

  animateRestartBtn(el: PIXI.Sprite, showRestart: () => void) {
    const endWidth = this.app.screen.width / 4;
    const endHeight = this.app.screen.height / 4;
    gsap.to(el, {
      width: endWidth,
      height: endHeight,
      x: (this.app.screen.width - endWidth) / 2,
      y: this.app.screen.height / 2 - endHeight,
      duration: 0.5,
      onComplete: () => {
        showRestart();
      },
    });
  }
}
