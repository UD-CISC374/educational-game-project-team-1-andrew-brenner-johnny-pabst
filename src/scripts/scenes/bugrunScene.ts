import ExampleObject from '../objects/exampleObject';

export default class bugrunScene extends Phaser.Scene {
  private exampleObject: ExampleObject;

  constructor() {
    super({ key: 'bugrunScene' });
  }

  create() {
    this.exampleObject = new ExampleObject(this, 0, 0);
  }

  update() {
  }
}
