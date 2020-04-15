import ExampleObject from '../objects/exampleObject';

export default class flyoverScene extends Phaser.Scene {
  private exampleObject: ExampleObject;

  constructor() {
    super({ key: 'flyoverScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);
  }

  update() {
  }
}
