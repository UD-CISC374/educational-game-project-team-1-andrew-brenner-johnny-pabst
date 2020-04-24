import { gameSettings } from "../game";


export default class flyoverScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  appleTree: Phaser.GameObjects.Sprite;
  treeTwo: Phaser.GameObjects.Sprite;
  hosts: Phaser.Physics.Arcade.Group;
  messageBox: Phaser.GameObjects.Sprite;
  closeButton: Phaser.GameObjects.Sprite;
  tutorialMsg: Phaser.GameObjects.Text;
  tutorialBox: Phaser.Physics.Arcade.Group;

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
    this.player.setCollideWorldBounds(true);

    //create flyover trees
    this.appleTree = this.add.sprite(100,500,"appleTree");
    this.treeTwo = this.add.sprite(570,350,"treeTwo");
    this.hosts = this.physics.add.group();
    this.hosts.add(this.appleTree);
    this.hosts.add(this.treeTwo);

    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    //switch to bugrun upon collision
    this.physics.add.overlap(this.player, this.hosts, this.enterRunScene, undefined, this);

    //create popup
    this.messageBox = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "messageBox");
    this.closeButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
    this.tutorialMsg = this.add.text(this.scale.width / 6 , this.scale.height / 3, 'Infest the area!\n Use the arrow keys to fly over to a tree.', { font: "30px Arial", fill: "#000000", align: "center" });
    this.tutorialBox = this.physics.add.group();
    this.closeButton.setInteractive();
    this.closeButton.on('pointerdown', this.destroyTutorial, this);
    this.closeButton.on('pointerup', this.mouseFix, this);
    this.closeButton.on('pointerout', this.mouseFix, this);


  }

  //close tutorial box
  destroyTutorial(){
    console.log("tutorial done");
    this.tutorialMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
  }
  //fixes click event crash
  mouseFix(){}
  

  enterRunScene() {
    this.scene.start('bugrunScene');
  }

  update() {
    this.movePlayerManager();
  }


  /**
   * Keyboard logic to move the player
   * Allows diagonal movement
   */
  movePlayerManager(){
    // avoid 'Object possibly undefined' errors
    if(this.cursorKeys.left !== undefined &&
      this.cursorKeys.right !== undefined &&
      this.cursorKeys.up !== undefined &&
      this.cursorKeys.down !== undefined){
    
      if(this.cursorKeys.left.isDown){
        this.player.setVelocityX(-gameSettings.playerSpeed);
        console.log("left");
      } else if(this.cursorKeys.right.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
        console.log("right");
      } else {
        this.player.setVelocityX(0); // stop movement when key is released
      }

      if(this.cursorKeys.up.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed);
        console.log("up");
      } else if(this.cursorKeys.down.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed);
        console.log("down");
      } else{
        this.player.setVelocityY(0); // stop movement when key is released
      }
    }
  }
}
