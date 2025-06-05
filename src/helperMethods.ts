import * as PIXI from "pixi.js";

export class helperMethods {
  constructor() {}

  //create PIXI container
  createContainer() {
    return new PIXI.Container();
  }
  //add children to container
  addChildrenToContainer(container: PIXI.Container, elements: any) {
    elements.forEach((element: any) => {
      container.addChild(element);
    });
  }
  //make height even
  evenHeight(element: any, reference: any) {
    element.height = reference.height;
  }
  //make width even
  evenWidth(element: any, reference: any) {
    element.width = reference.width;
  }
  //create PIXI Background with Sprite
  createBackground(
    tint: string,
    alpha: number,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    const background: PIXI.Sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    background.tint = tint;
    background.alpha = alpha;
    background.width = width;
    background.height = height;
    background.x = x;
    background.y = y;
    return background;
  }
  //create PIXI Background with Graphics
  createRoundedBackground(
    fill: string,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    alpha: number = 1
  ) {
    const rBack: PIXI.Graphics = new PIXI.Graphics();
    rBack.fill(fill);
    rBack.roundRect(x, y, w, h, radius);
    rBack.fill();
    rBack.alpha = alpha;
    return rBack;
  }
  //create PIXI Text
  createText(text: string, fontSize: number, fill: string) {
    return new PIXI.Text({
      text: text,
      style: {
        fontFamily: "Arial",
        fontSize: fontSize,
        fill: fill,
        align: "center",
      },
    });
  }

  startAnimation(element: PIXI.AnimatedSprite) {
    element.play();
    element.alpha = 1;
    element.height = element.height + 10;
    element.width = element.width + 10;
    this.colorAnimation(element);
  }

  stopAnimation(element: PIXI.AnimatedSprite) {
    element.gotoAndStop(0);
    element.alpha = 0.5;
    element.width = 100;
    element.height = 100;
    this.grayAnimation(element);
  }

  chosenSkin(
    element: PIXI.Sprite,
    mainContainer: PIXI.Container,
    removeContainer: PIXI.Container,
    background: PIXI.Container
  ) {
    element.onpointerdown = () => {
      mainContainer.removeChild(removeContainer);
    };
    background.filters = [];
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
