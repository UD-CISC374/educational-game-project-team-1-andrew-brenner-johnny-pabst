export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("flyoverBackground", "assets/images/farmBG.jpg");
  }

  create() {
    this.scene.start('flyoverScene');
  }
}
