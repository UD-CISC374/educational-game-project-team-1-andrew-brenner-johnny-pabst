import { gameSettings } from "../game";

export default class bugrunScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  mantis: Phaser.GameObjects.Sprite;
  obstacles: Phaser.Physics.Arcade.Group;
  timeInSeconds: number;
  timeText: Phaser.GameObjects.Text;
  timeNum: number;
  feedSpots: Phaser.Physics.Arcade.Group;
  feedSpot: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'bugrunScene' });
  }

  create() {
    // create background
    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "bugrunBackground");
    this.background.setOrigin(0,0);
    
    //create timer
    this.timeNum = 120;
    this.timeText = this.add.text(10, 7, 'Time Remaining: 120', { font: "64px Arial", fill: "#ffffff", align: "center" });

    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "playerFly");
    this.player.play("playerFly");
    this.player.setCollideWorldBounds(true);

    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    

    // spawn prayingMantis
    this.mantis = this.add.sprite(10, 50, "mantisMoveRight");
    this.mantis.play("mantisMoveRight");

    //add mantis to enemy group
    this.obstacles = this.physics.add.group();
    this.obstacles.add(this.mantis);

    //add feedSpots in every 15 seconds
    this.feedSpots = this.physics.add.group();
    this.time.addEvent({
      delay:15000,
      callback:this.spawnFeedSpot,
      callbackScope:this,
      loop: true
    })


    // praying Mantis collides into player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, undefined, this);

    //timer
    this.updateTime();
  }



  update() {
    this.background.tilePositionY -= 2; // scroll background
    this.movePlayerManager(); // listen for player movement
    this.moveMantis();

  } 


  // Controls movemnt of the pray mantis object
  moveMantis() {
      this.mantis.setX(this.mantis.x + 5);
      this.mantis.setY(this.mantis.y + 2)
  }

  //spawn in feed spot randomly
  spawnFeedSpot(){
    var feedSpotCount = 1;
    for (var i =0; i<= feedSpotCount; i++){
      var feedSpot = this.physics.add.sprite(100,105,"feedSpot");
      this.feedSpots.add(feedSpot);
      feedSpot.setRandomPosition(0,0,this.scale.width, 0);
      feedSpot.setVelocity(0,120);
    }
  }

  updateTime(){
    console.log("BRUH");
    this.time.addEvent({
      delay:1000,
      callback:this.updateTimeText,
      callbackScope:this,
      loop: true
    })
  }

  updateTimeText(){
    console.log(this.timeNum);
    if (this.timeNum > 0) {
      this.timeNum--;
      this.timeText.text = "Time Remaining: " + this.timeNum;
    }
    else{
      this.scene.start("flyoverScene");
    }
  }

  //despawn bug and delay before reset
  killBug(){
    this.player.disableBody(true, true);
    console.log("collision");
    this.time.addEvent({
      delay:1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  //reset player position
  resetPlayer(){
    let x = this.scale.width - 400;
    let y = this.scale.height;
    this.player.enableBody(true,x,y,true,true);

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player,
      y: this.scale.height - 75,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this
    });
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
    
        // left and right
      if(this.cursorKeys.left.isDown){
        this.player.setVelocityX(-gameSettings.playerSpeed);
        console.log("left");
      } else if(this.cursorKeys.right.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
        console.log("right");
      } else {
        this.player.setVelocityX(0); // stop movement when key is released
      }

      // up and down
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
