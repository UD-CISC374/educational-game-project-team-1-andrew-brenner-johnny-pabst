export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load_images();
    this.load_spritesheets();
    this.load_audio();
    this.load.bitmapFont("font", "assets/font/font.png", "assets/font/font.fnt");
  }

  // Loads all the spritesheets necessary for application 
  load_spritesheets(){
    this.load.spritesheet("player", "./assets/spritesheets/flyAnimationREAL.png", {
        frameWidth: 92,
        frameHeight: 51
    });
    this.load.spritesheet("dummy", "./assets/spritesheets/closedFly.png", {
        frameWidth: 41,
        frameHeight: 45
    });
    this.load.spritesheet("prayingMantisRight", "./assets/spritesheets/prayingMantisRight.png",{
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("prayingMantisLeft", "./assets/spritesheets/prayingMantisLeft.png",{
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("egg","./assets/spritesheets/egg.png",{
      frameWidth: 22,
      frameHeight: 30
    });
    this.load.spritesheet("pesticideWarning","./assets/spritesheets/pesticideWarning.png",{
      frameWidth: 400,
      frameHeight: 400
    });
    this.load.spritesheet("pesticideZone","./assets/spritesheets/pesticideZone.png",{
      frameWidth: 400,
      frameHeight: 400
    });
    this.load.spritesheet("arrow", "./assets/spritesheets/arrow.png", {
      frameWidth: 104,
      frameHeight: 125
    });
    this.load.spritesheet("appleTreeAnim", "./assets/spritesheets/appleTreeAnim.png", {
      frameWidth: 194,
      frameHeight: 156
    });
    this.load.spritesheet("treeOfHeaven", "./assets/spritesheets/treeOfHeaven.png", {
      frameWidth: 100,
      frameHeight: 112
    });
    this.load.spritesheet("blackWalnut", "./assets/spritesheets/blackWalnut.png", {
      frameWidth: 163,
      frameHeight: 158
    });
    this.load.spritesheet("sadBird", "./assets/spritesheets/sadBird.png", {
      frameWidth: 300,
      frameHeight: 300
    });
  }

  
  //Loads all the images necessary for application
  load_images(){
    this.load.image("flyoverBackground", "./assets/images/farmBG.jpg");
    this.load.image("bugrunBackground", "./assets/images/treeBark.jpg");
    this.load.image("bottomBounds", "./assets/images/blackBar.png");
    this.load.image("cherryTree", "./assets/images/cherryTree.png");
    this.load.image("messageBox", "./assets/images/messageBox.png");
    this.load.image("closeButton", "./assets/images/closeButton.png");
    this.load.image("deadAppleTree", "./assets/images/deadAppleTree.png");
    this.load.image("checkMark", "./assets/images/checkMark.png");
    this.load.image("eggZone", "./assets/images/eggZone.png");
    this.load.image("feedSpot", "./assets/images/feedSpot.png");
    this.load.image("buzzCapone", "./assets/images/buzzCapone.png");
    this.load.image("grapeVine", "./assets/images/grapeVine.png");
    this.load.image("deadGrapeVine", "./assets/images/deadGrapeVine.png");
    this.load.image("deadCherryTree", "./assets/images/deadCherryTree.png");
    this.load.image("deadTreeOfHeaven", "./assets/images/deadTreeOfHeaven.png");
    this.load.image("deadBlackWalnut", "./assets/images/deadBlackWalnut.png");
    this.load.image("treeLabel", "./assets/images/treeLabel.png");
    this.load.image("titleScreen", "./assets/images/titleScreen.png");
    this.load.image("titleStart", "./assets/images/titleStart.png");
    this.load.image("lock", "./assets/images/lock.png");
    this.load.image("endCredits", "./assets/images/endCred1.png");
    this.load.image("resetButton", "./assets/images/resetButton.png");
  }

  //loads all sound effects and background music
  load_audio(){
    this.load.audio("bugBoogie", "./assets/sounds/bumbleBoogie.mp3");
    this.load.audio("tutorialJam", "./assets/sounds/tutorialJam.ogg");
    this.load.audio("farmSounds", "./assets/sounds/farmSounds.ogg");
    this.load.audio("pop", "./assets/sounds/pop.ogg");
    this.load.audio("spray", "./assets/sounds/spray.ogg");
    this.load.audio("munch", "./assets/sounds/munch.ogg");
    this.load.audio("death", "./assets/sounds/death.ogg")
  }


  create() {
    this.create_spritesheets();
    this.scene.start('titleScene');
    //this.scene.start('flyoverScene');
    //this.scene.start('bugrunScene');
    //this.scene.start('bugrunTutorialScene'); 
    //this.scene.start('endScene');
  }


  // Creates all the spritesheets necessary for application
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
    this.anims.create({
      key: "mantisMoveRight",
      frames: this.anims.generateFrameNumbers("prayingMantisRight", {
        start: 0,
        end: 9
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "mantisMoveLeft",
      frames: this.anims.generateFrameNumbers("prayingMantisLeft", {
        start: 0,
        end: 9
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "pesticideWarning",
      frames: this.anims.generateFrameNumbers("pesticideWarning", {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "pesticideZone",
      frames: this.anims.generateFrameNumbers("pesticideZone", {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "arrow",
      frames: this.anims.generateFrameNumbers("arrow", {
        start: 0,
        end: 45
      }),
      frameRate: 90,
      repeat: -1
    });
    this.anims.create({
      key: "appleTreeAnim",
      frames: this.anims.generateFrameNumbers("appleTreeAnim", {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "treeOfHeaven",
      frames: this.anims.generateFrameNumbers("treeOfHeaven", {
        start: 0,
        end: 4
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "blackWalnut",
      frames: this.anims.generateFrameNumbers("blackWalnut", {
        start: 0,
        end: 5
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sadBird",
      frames: this.anims.generateFrameNumbers("sadBird", {
        start: 0,
        end: 9
      }),
      frameRate: 20,
      repeat: -1
    });
  }
}
