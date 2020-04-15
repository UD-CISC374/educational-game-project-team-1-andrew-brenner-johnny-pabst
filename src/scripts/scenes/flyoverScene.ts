import ExampleObject from '../objects/exampleObject';

export default class flyoverScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

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

    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys()

  }

  update() {

    this.movePlayerManager();


  }

movePlayerManager(): void{
  if(this.cursorKeys.left !== undefined &&
    this.cursorKeys.right !== undefined &&
    this.cursorKeys.up !== undefined &&
    this.cursorKeys.down !== undefined){
    
    if (this.cursorKeys.left.isDown){
      this.player.setVelocityX(-200);
      this.player.setVelocityY(0);
    } else if(this.cursorKeys.right.isDown){
      this.player.setVelocityX(200);
      this.player.setVelocityY(0);
    } else if(this.cursorKeys.up.isDown){
      this.player.setVelocityY(-200);
      this.player.setVelocityX(0);
    } else if(this.cursorKeys.down.isDown){
      this.player.setVelocityY(200);
      this.player.setVelocityX(0);
    }
  }
}
