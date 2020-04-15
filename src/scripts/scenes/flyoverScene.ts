import ExampleObject from '../objects/exampleObject';

export default class flyoverScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'flyoverScene' });
  }

  preload(){
    this.load.image("flyoverBackground", "assets/images/farmBG.jpg");

  }

  create() {
    this.background = this.add.image(0,0,"flyoverBackground");
    this.background.setOrigin(0,0);
    
  }

  update() {
  }
}
