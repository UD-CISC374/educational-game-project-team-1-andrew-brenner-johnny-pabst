import { gameSettings } from "../game";
import { flags } from "../game";


export default class flyoverScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  appleTree: Phaser.GameObjects.Image;
  treeTwo: Phaser.GameObjects.Image;
  hosts: Phaser.Physics.Arcade.Group;
  messageBox: Phaser.GameObjects.Sprite;
  closeButton: Phaser.GameObjects.Sprite;
  tutorialMsg: Phaser.GameObjects.Text;
  tutorialBox: Phaser.Physics.Arcade.Group;
  treeTwoCheckMark: Phaser.GameObjects.Image;
  appleTreeCheckMark: Phaser.GameObjects.Image;

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
    this.hosts = this.physics.add.group();
    if(flags.appleTreeDead){
      this.appleTree = this.add.image(100,500,"deadTree2");
      this.appleTreeCheckMark = this.add.image(150,450, "checkMark");
    } else{
      this.appleTree = this.add.image(100,500,"appleTree");
      this.hosts.add(this.appleTree);
    } 
    if(flags.treeTwoDead){
      this.treeTwo = this.add.image(570,350,"deadTree3");
      this.treeTwoCheckMark = this.add.image(600,300, "checkMark");
    } else{
      this.treeTwo = this.add.image(570,350,"treeTwo");
      this.hosts.add(this.treeTwo);
    }
    this.appleTree.name = "appleTree";
    this.treeTwo.name = "treeTwo";

    //switch to bugrun upon collision
    //this.physics.add.overlap(this.player, this.hosts, this.enterRunScene, undefined, this);
    this.physics.add.collider(this.player, this.hosts, this.enterRunScene , function(player, host){
      switch(host.name) { 
        case "appleTree": { 
           flags.appleTreeDead = true; 
           return flags.appleTreeDead; 
        } 
        case "treeTwo": { 
           flags.treeTwoDead = true; 
           return flags.treeTwoDead 
        } 
        default: { 
           console.log("host plant images unchanged"); 
           return false; 
        } 
     }
    }, this);



    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    
    if(!flags.flyoverTutDone){
      //create popup
      this.messageBox = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "messageBox");
      this.closeButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
      this.tutorialMsg = this.add.text(this.scale.width / 6 , this.scale.height / 3, 'Infest the area!\n Use the arrow keys to fly over to a tree.', { font: "30px Arial", fill: "#000000", align: "center" });
      this.tutorialBox = this.physics.add.group();
      this.closeButton.setInteractive();
      this.closeButton.on('pointerdown', this.destroyTutorial, this);
      this.closeButton.on('pointerup', this.mouseFix, this);
      this.closeButton.on('pointerout', this.mouseFix, this);
      flags.flyoverTutDone = true;
    }

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
