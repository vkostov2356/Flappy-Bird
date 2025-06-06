import * as PIXI from "pixi.js";

export class helperMethods {
  constructor() {}

  //add children to container
  addChildrenToContainer(container: PIXI.Container, elements: any) {
    elements.forEach((element: any) => {
      container.addChild(element);
    });
  }

  //remove child from container

  removeChild(parent: PIXI.Container, child: PIXI.Container) {
    parent.removeChild(child);
  }

  //make height even
  evenHeight(element: any, reference: any) {
    element.height = reference.height;
  }
  //make width even
  evenWidth(element: any, reference: any) {
    element.width = reference.width;
  }

  startAnimation(main: PIXI.Sprite[], animated: PIXI.AnimatedSprite[]) {
    for (let i = 0; i < main.length; i++) {
      main[i].onpointerover = () => {
        animated[i].play();
        animated[i].alpha = 1;
        animated[i].height = animated[i].height + 10;
        animated[i].width = animated[i].width + 10;
        this.colorAnimation(animated[i]);
      };
    }
  }

  stopAnimation(main: PIXI.Sprite[], animated: PIXI.AnimatedSprite[]) {
    for (let i = 0; i < main.length; i++) {
      main[i].onpointerout = () => {
        animated[i].gotoAndStop(0);
        animated[i].alpha = 0.5;
        animated[i].width = 100;
        animated[i].height = 100;
        this.grayAnimation(animated[i]);
      };
    }
  }

  grayAnimation(element: PIXI.AnimatedSprite) {
    const grayFilter = new PIXI.ColorMatrixFilter();
    grayFilter.desaturate();
    element.filters = [grayFilter];
  }

  colorAnimation(element: PIXI.AnimatedSprite) {
    element.filters = [];
  }
}
