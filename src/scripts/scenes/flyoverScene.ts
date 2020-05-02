import { gameSettings } from "../game";
import { flags } from "../game";


export default class flyoverScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  hosts: Phaser.Physics.Arcade.Group;
  messageBox: Phaser.GameObjects.Sprite;
  closeButton: Phaser.GameObjects.Sprite;
  tutorialMsg: Phaser.GameObjects.Text;
  tutorialBox: Phaser.Physics.Arcade.Group;
  appleTree: Phaser.GameObjects.Sprite;
  deadAppleTree: Phaser.GameObjects.Image;
  appleTreeCheckMark: Phaser.GameObjects.Image;
  grapeVine: Phaser.GameObjects.Image;
  deadGrapeVine: Phaser.GameObjects.Image;
  grapeVineCheckMark: Phaser.GameObjects.Image;
  cherryTree: Phaser.GameObjects.Image;
  cherryTreeDead: Phaser.GameObjects.Image;
  cherryTreeCheckMark: Phaser.GameObjects.Image;

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
    if(flags.cherryTreeDead){ // Cherry Tree
      this.cherryTreeDead = this.add.image(100,500,"cherryTreeDead");
      this.cherryTreeCheckMark = this.add.image(150,450, "checkMark");
    } else{
      this.cherryTree = this.add.image(100,500,"cherryTree");
      this.hosts.add(this.cherryTree);
    } 
    if(flags.appleTreeDead){ // Apple Tree
      this.deadAppleTree = this.add.image(570,350,"deadTree3");
      this.appleTreeCheckMark = this.add.image(600,400, "checkMark");
    } else{
      this.appleTree = this.add.sprite(570, 350, "appleTreeAnim");
      this.appleTree.play("appleTreeAnim");
      this.hosts.add(this.appleTree);
    }
    if(flags.grapeVineDead){ // Grape Vine
      this.deadGrapeVine = this.add.image(260,285, "deadGrapeVine");
      this.grapeVineCheckMark = this.add.image(290,335, "checkMark");
    } else{
      this.grapeVine = this.add.image(260,285, "grapeVine");
    }
    // Set names in order to check collisions later
    this.cherryTree.name = "cherryTree";
    this.appleTree.name = "appleTree";
    this.grapeVine.name = "grapeVine";
    


    //switch to bugrun upon collision
    //this.physics.add.overlap(this.player, this.hosts, this.enterRunScene, undefined, this);
    this.physics.add.collider(this.player, this.hosts, this.enterRunScene , function(player, host){
      switch(host.name) { 
        case "appleTree": { 
           flags.appleTreeDead = true;
           return flags.appleTreeDead;
        } 
        case "cherryTree": { 
           flags.cherryTreeDead = true; 
           return flags.cherryTreeDead;
        }
        case "grapeVine": { 
          flags.grapeVineDead = true; 
          return flags.grapeVineDead;
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
  
  /**
   * enterRunScene called when user collides with a tree
   * If they have not completed the tutorial they will do so now
   * Otherwise, start normal bugrun
   */
  enterRunScene() {
    if(!flags.bugRunTutDone){ // tutorial has not yet been completed
      this.scene.start('bugrunTutorialScene');
    } else {
      this.scene.start('bugrunScene');
    }
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
