import ExampleObject from '../objects/exampleObject';

export default class flyoverScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: 'flyoverScene' });
  }

  create() {

    // create background
    this.background = this.add.image(0,0,"flyoverBackground");
    this.background.setOrigin(0,0);
    
    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "playerFly");
    this.player.play("playerFly");



  }

  update() {
  }
}
