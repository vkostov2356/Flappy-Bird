import * as PIXI from "pixi.js";

export class utils {
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

  //center element aligned with the parent
  centerElement(parent: any, child: any) {
    child.x = parent.width / 2 - child.width / 2;
    child.y = parent.height / 2 - child.height / 2;
  }

  //creating a gray filter for a sprite
  grayAnimation(element: PIXI.AnimatedSprite) {
    const grayFilter = new PIXI.ColorMatrixFilter();
    grayFilter.desaturate();
    element.filters = [grayFilter];
  }

  //remove filters from an element
  // colorAnimation - previous name
  removeFilters(element: PIXI.AnimatedSprite) {
    element.filters = [];
  }

  //scale an element and then center it to its parent
  hoverScale(elements: [PIXI.Sprite, PIXI.Text], parent: any) {
    elements[0].onpointerover = () => {
      elements[0].scale = 1.2;
      elements[1].scale = 1.2;
      this.centerElement(parent, elements[0]);
      this.centerElement(parent, elements[1]);
    };

    elements[0].onpointerout = () => {
      elements[0].scale = 1;
      elements[1].scale = 1;
      this.centerElement(parent, elements[0]);
      this.centerElement(parent, elements[1]);
    };
  }

  //begin animation on hover
  startAnimation(main: PIXI.Sprite[], animated: PIXI.AnimatedSprite[]) {
    for (let i = 0; i < main.length; i++) {
      main[i].onpointerover = () => {
        animated[i].play();
        animated[i].alpha = 1;
        animated[i].height = animated[i].height + 10;
        animated[i].width = animated[i].width + 10;
        this.removeFilters(animated[i]);
      };
    }
  }

  //stop animation on mouse out
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

  //remove pixel background
  removePixelBackground(
    tickerBlur: PIXI.Ticker,
    blurFilter: PIXI.BlurFilter,
    element: PIXI.Sprite
  ) {
    tickerBlur.add(() => {
      if (blurFilter.strength > 0) {
        blurFilter.strength -= 0.1;
      } else {
        element.filters = [];
        tickerBlur.stop();
      }
    });
    tickerBlur.start();
  }
}
