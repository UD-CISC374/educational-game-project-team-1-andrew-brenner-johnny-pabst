export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load_images();
    this.load_spritesheets();
  }

  /**
   * Loads all the spritesheets necessary for application
   */
  load_spritesheets(){
    this.load.spritesheet("player", "assets/spritesheets/fly-animation.png", {
        frameWidth: 100,
        frameHeight: 50
      });
  }

  /**
   * Loads all the spritesheets necessary for application
   */
  load_images(){
    this.load.image("flyoverBackground", "assets/images/farmBG.jpg");
  }





  create() {
    this.create_spritesheets();
    this.scene.start('flyoverScene');
  }

  /**
   * Creates all the spritesheets necessary for application
   */
  create_spritesheets(){
    this.anims.create({
      key: "playerFly",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
  }
}
