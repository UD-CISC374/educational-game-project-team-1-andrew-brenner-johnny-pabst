import { gameSettings } from "../game";
import { flags } from "../game";
import { threadId } from "worker_threads";


export default class flyoverScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  hosts: Phaser.Physics.Arcade.Group;
  messageBox: Phaser.GameObjects.Image;
  closeButton: Phaser.GameObjects.Image;
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
  music: Phaser.Sound.BaseSound;
  boss: Phaser.GameObjects.Image;
  deadTreeOfHeaven: Phaser.GameObjects.Image;
  treeOfHeavenCheckMark: Phaser.GameObjects.Image;
  treeOfHeaven: Phaser.GameObjects.Sprite;
  deadBlackWalnut: Phaser.GameObjects.Image;
  blackWalnutCheckMark: Phaser.GameObjects.Image;
  blackWalnut: Phaser.GameObjects.Sprite;
  treeLabel: Phaser.GameObjects.Image;
  labelText: Phaser.GameObjects.Text;
  sadBird: Phaser.GameObjects.Sprite;
  endGameLabel: Phaser.GameObjects.BitmapText;
  scoreText: Phaser.GameObjects.Text;
  msgOpen: boolean;
  tutOpen: boolean;
  blackWalnutLock: Phaser.GameObjects.Image;
  grapeVineLock: Phaser.GameObjects.Image;
  appleTreeLock: Phaser.GameObjects.Image;
  treeOfHeavenLock: Phaser.GameObjects.Image;
  cherryTreeX: number = 285;
  cherryTreeY: number = 565;
  blackWalnutX: number = 200;
  blackWalnutY: number = 435;
  grapeVineX: number = 255;
  grapeVineY: number = 290;
  appleTreeX: number = 570;
  appleTreeY: number = 350;
  treeOfHeavenX: number = 705;
  treeOfHeavenY: number = 565;



  constructor() {
    super({ key: 'flyoverScene' });
  }

  create() {
    console.log("levels completed: " + flags.levelsCompleted);

    // create background
    this.background = this.add.image(0,0,"flyoverBackground");
    this.background.setOrigin(0,0);

    //load in music
    this.music = this.sound.add("farmSounds");
    var musicConfig = {
      mute: false,
      volume: 1,
      rate:1,
      detune:0,
      seek:0,
      loop: false,
      delay: 0
    }
    
    this.music.play(musicConfig);
    
    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "playerFly");
    this.player.play("playerFly");
    this.player.setCollideWorldBounds(true);

    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // create score label
    this.scoreText = this.add.text(0, this.scale.height - 36, 'Total Score: ' + gameSettings.totalScore, { font: "32px Arial", fill: "#ffffff", align: "left" });

    // create flyover trees
    this.hosts = this.physics.add.group();
    // Cherry Tree
    if(flags.cherryTreeDead){
      this.cherryTreeDead = this.add.image(this.cherryTreeX - 7,this.cherryTreeY - 21,"deadCherryTree");
      this.cherryTreeCheckMark = this.add.image(this.cherryTreeX + 60,this.cherryTreeY + 60, "checkMark");
    } else{
      this.cherryTree = this.add.image(this.cherryTreeX, this.cherryTreeY, "cherryTree");
      this.cherryTree.name = "cherryTree";
      this.hosts.add(this.cherryTree);
    } 
    // Apple Tree
    if(flags.appleTreeDead){
      this.deadAppleTree = this.add.image(this.appleTreeX + 15,this.appleTreeY - 35,"deadAppleTree");
      this.appleTreeCheckMark = this.add.image(this.appleTreeX + 67,this.appleTreeY + 48, "checkMark");
    } else{
      this.appleTree = this.add.sprite(this.appleTreeX, this.appleTreeY, "appleTreeAnim");
      this.appleTree.play("appleTreeAnim");
      this.appleTree.name = "appleTree";
      if(flags.levelsCompleted >= 2){ // unlocked
        this.hosts.add(this.appleTree);
      } else { // locked
        this.appleTree.alpha = 0.5;
        this.appleTreeLock = this.add.image(this.appleTreeX + 5, this.appleTreeY - 15, "lock");
      }
    }
    // Grape Vine
    if(flags.grapeVineDead){
      this.deadGrapeVine = this.add.image(this.grapeVineX,this.grapeVineY, "deadGrapeVine");
      this.grapeVineCheckMark = this.add.image(this.grapeVineX + 57,this.grapeVineY + 23, "checkMark");
    } else{
      this.grapeVine = this.add.image(this.grapeVineX,this.grapeVineY, "grapeVine");
      this.grapeVine.name = "grapeVine";
      if(flags.levelsCompleted >= 2){ // unlocked
        this.hosts.add(this.grapeVine);
      } else { // locked
        this.grapeVine.alpha = 0.5;
        this.grapeVine = this.add.image(this.grapeVineX, this.grapeVineY, "lock");
      }
    }
    // Tree of Heaven
    if(flags.treeOfHeavenDead){
      this.deadTreeOfHeaven = this.add.image(this.treeOfHeavenX,this.treeOfHeavenY - 10,"deadTreeOfHeaven");
      this.treeOfHeavenCheckMark = this.add.image(this.treeOfHeavenX + 62,this.treeOfHeavenY + 45, "checkMark");
    } else{
      this.treeOfHeaven = this.add.sprite(this.treeOfHeavenX, this.treeOfHeavenY, "treeOfHeaven");
      this.treeOfHeaven.play("treeOfHeaven");
      this.treeOfHeaven.name = "treeOfHeaven";
      if(flags.levelsCompleted == 4){ // unlocked
        this.hosts.add(this.treeOfHeaven);
      } else { // locked
        this.treeOfHeaven.alpha = 0.5;
        this.treeOfHeavenLock = this.add.image(this.treeOfHeavenX + 2, this.treeOfHeavenY - 12, "lock");
      }
    }
    // Black Walnut Tree
    if(flags.blackWalnutDead){
      this.deadBlackWalnut = this.add.image(this.blackWalnutX - 30,this.blackWalnutY +25,"deadBlackWalnut");
      this.blackWalnutCheckMark = this.add.image(this.blackWalnutX + 40,this.blackWalnutY + 58, "checkMark");
    } else{
      this.blackWalnut = this.add.sprite(this.blackWalnutX, this.blackWalnutY, "blackWalnut");
      this.blackWalnut.play("blackWalnut");
      this.blackWalnut.name = "blackWalnut";
      if(flags.levelsCompleted == 1) { // unlocked
        this.hosts.add(this.blackWalnut);
      } else { // locked
        this.blackWalnut.alpha = 0.5;
        this.blackWalnutLock = this.add.image(this.blackWalnutX - 10, this.blackWalnutY - 20, "lock");
      }
    }    
    
    //create tree labels
    this.createTreeLabel(this.cherryTreeX,this.cherryTreeY + 35, "   Cherry Tree");
    this.createTreeLabel(this.treeOfHeavenX,this.treeOfHeavenY + 18,"Tree of Heaven");
    this.createTreeLabel(this.blackWalnutX - 20, this.blackWalnutY + 35, "  Black Walnut");
    this.createTreeLabel(this.grapeVineX,this.grapeVineY,"   Grape Vine");
    this.createTreeLabel(this.appleTreeX + 7,this.appleTreeY + 23, "    Apple Tree");

    //switch to bugrun upon collision
    //this.physics.add.overlap(this.player, this.hosts, this.enterRunScene, undefined, this);
    this.physics.add.collider(this.player, this.hosts, this.enterRunScene , function(player, host){
      switch(host.name) { 
        case "appleTree": { 
           flags.appleTreeDead = true;
           flags.latestHost = host.name;
           return flags.appleTreeDead;
        } 
        case "cherryTree": { 
           flags.cherryTreeDead = true; 
           flags.latestHost = host.name;
           return flags.cherryTreeDead;
        }
        case "grapeVine": { 
          flags.grapeVineDead = true; 
          flags.latestHost = host.name;
          return flags.grapeVineDead;
        }
        case "treeOfHeaven": { 
          flags.treeOfHeavenDead = true; 
          flags.latestHost = host.name;
          return flags.treeOfHeavenDead;
        }
        case "blackWalnut": { 
          flags.blackWalnutDead = true; 
          flags.latestHost = host.name;
          return flags.blackWalnutDead;
        }
        default: { 
           console.log("host plant images unchanged"); 
           return false; 
        } 
     }
    }, this);

    
    if(!flags.flyoverTutDone){
      //create popup
      this.messageBox = this.add.image(this.scale.width / 2, this.scale.height / 2, "messageBox");
      this.closeButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
      this.boss = this.add.image(this.scale.width / 4 - 20, this.scale.height / 2 - 20, "buzzCapone");
      this.tutorialMsg = this.add.text(this.scale.width / 4 + 65, this.scale.height / 3 + 20, ' How ya doin, kid. The name is Buzz Capone.\n I\'m the boss of the Spotted Lanternflies.\n We need your help infesting this farm, capeesh?\n Find us somethin\' good.\n \n Use the arrow keys to move to a host tree', { font: "20px Arial", fill: "#000000", align: "left" });
      this.tutorialBox = this.physics.add.group();
      this.closeButton.setInteractive();
      this.closeButton.on('pointerdown', this.destroyTutorial, this);
      this.closeButton.on('pointerup', this.mouseFix, this);
      this.closeButton.on('pointerout', this.mouseFix, this);
      this.tutOpen = true;
      flags.flyoverTutDone = true;
    } else{
      // tutorial has been completed, create pop-up depending on the last bug run completed

      //create popup
      this.messageBox = this.add.image(this.scale.width / 2, this.scale.height / 2, "messageBox");
      this.closeButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
      this.sadBird = this.add.sprite(this.scale.width / 4 - 20, this.scale.height / 2 - 20, "sadBird");
      this.sadBird.play("sadBird");
      this.tutorialBox = this.physics.add.group();
      this.closeButton.setInteractive();
      this.closeButton.on('pointerdown', this.destroyPopUp, this);
      this.closeButton.on('pointerup', this.mouseFix, this);
      this.closeButton.on('pointerout', this.mouseFix, this);
      this.msgOpen = true;
      let birdMessage: string = "";
      switch(flags.latestHost){
        case "appleTree": {
          birdMessage = "Oh my!\nNot the Apples!\nThat was just plain evil.";
          break;
        }
        case "cherryTree": {
          birdMessage = "What have you done!?\nNow what am I supposed to\nput on top of my ice cream?"
          break;
        }
        case "grapeVine": {
          birdMessage = "No grapes means no more PB&J's :("
          break;
        }
        case "treeOfHeaven": {
          birdMessage = "How could you?\nThe Tree of Heaven was my favorite.";
          break;
        }
        case "blackWalnut": {
          birdMessage = "Aw nuts!\nNow the Black Walnut Tree!?\n";
          break;
        }
        default: {
          birdMessage = "Oh no!\n ";
          break;
        }
      }
      this.tutorialMsg = this.add.text(this.scale.width / 4 + 65, this.scale.height / 3 + 20, birdMessage, { font: "20px Arial", fill: "#000000", align: "left" });
    } // end if

    // If all levels are completed -> Game Over
    if(flags.appleTreeDead && flags.cherryTreeDead && flags.grapeVineDead && flags.treeOfHeavenDead && flags.blackWalnutDead){
      this.endGame();
    }

  } // end create()



  //create labels for each tree on overworld
  createTreeLabel(x: number, y: number, label: string){
    this.treeLabel = this.add.image(x, y +50, "treeLabel");
    this.labelText = this.add.text(x-50,y+42,label,{ font: "14px Arial", fill: "#000000", align: "center" });
  }

  //close tutorial box
  destroyTutorial(){
    console.log("tutorial done");
    this.boss.destroy();
    this.tutorialMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
    this.tutOpen = false;
  }
  //fixes click event crash
  mouseFix(){}

  destroyPopUp(){
    console.log("pop-up gone");
    this.sadBird.destroy();
    this.tutorialMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
    this.msgOpen = false;
  }

  endGame(){
    // Launch endScene
    this.endGameLabel = this.add.bitmapText(this.scale.width / 5, this.scale.height / 10, "font", "You Win!", 300, 1);
  }


  
  /**
   * enterRunScene called when user collides with a tree
   * If they have not completed the tutorial they will do so now
   * Otherwise, start normal bugrun
   */
  enterRunScene() {
    this.sound.remove(this.music);
    if(!flags.bugRunTutDone){ // tutorial has not yet been completed
      this.scene.start('bugrunTutorialScene');
    } else {
      this.scene.start('bugrunScene');
    }
  }


  update() {
    this.movePlayerManager();

    if(this.tutOpen && Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.destroyTutorial();
    } else if(this.msgOpen && Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.destroyPopUp();
    }
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
      } else if(this.cursorKeys.right.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
      } else {
        this.player.setVelocityX(0); // stop movement when key is released
      }

      if(this.cursorKeys.up.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed);
      } else if(this.cursorKeys.down.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed);
      } else{
        this.player.setVelocityY(0); // stop movement when key is released
      }
    }
  }
}
