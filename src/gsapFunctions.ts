import * as PIXI from "pixi.js";
import gsap from "gsap";
export class gsapFunctions {
  private app!: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  //animation of the bird after clicking START
  // startingBirdAnimation(animation: PIXI.AnimatedSprite, callback?: () => void) {
  //   gsap.to(animation, {
  //     x: this.app!.screen.width + animation.width,
  //     duration: 0.1, //2
  //     ease: "power1.inOut",
  //     onComplete: () => {
  //       animation.width = animation.width / 2;
  //       animation.height = animation.height / 2;
  //       this.startingPositionBird(animation, () => callback);
  //     },
  //   });
  // }

  //restart the bird position
  startingPositionBird(animation: PIXI.AnimatedSprite, callback?: () => {}) {
    gsap.fromTo(
      animation,
      { x: 0, y: this.app!.screen.height / 2 / 2 },
      {
        x: animation.width * 2,
        duration: 0.1, //0.5
        onComplete: () => {
          callback!;
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
}
