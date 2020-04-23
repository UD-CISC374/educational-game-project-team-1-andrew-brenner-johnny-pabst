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
  spacebar: Phaser.Input.Keyboard.Key;
  eggGroup: Phaser.Physics.Arcade.Group;
  otherFlies: Phaser.Physics.Arcade.Group;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  OBSTACLE_VELOCITY: number = 40;

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

    //create score
    this.score = 0;
    this.scoreText = this.add.text(this.scale.width / 2, this.scale.height - 50, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });

    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "playerFly");
    this.player.play("playerFly");
    this.player.setCollideWorldBounds(true);

    // setup keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //create group for enemy obstacles
    this.obstacles = this.physics.add.group();
    //create group for other flies
    this.otherFlies = this.physics.add.group();
    //create group for feedspots
    this.feedSpots = this.physics.add.group();
    //create group for eggs
    this.eggGroup = this.physics.add.group();
    

    // ** TIMED EVENTS **
    //timer
    this.time.addEvent({
      delay:1000,
      callback:this.updateTimeText,
      callbackScope:this,
      loop: true
    })
    // spawning feed spots
    this.time.addEvent({
      delay:15000,
      callback:this.spawnFeedSpot,
      callbackScope:this,
      loop: true
    })
    // spawning other flies
    this.time.addEvent({
      delay:1000,
      callback:this.spawnFlies,
      callbackScope:this,
      loop: true
    })


    // praying Mantis collides into player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, undefined, this);
    //player lays eggs on feed spot
    this.physics.add.overlap(this.player, this.feedSpots, this.layEggs, undefined, this);
  }



  update() {
    this.background.tilePositionY -= 5; // scroll background
    this.movePlayerManager(); // listen for player movement
    //this.moveMantis();

    this.physics.add.collider(this.player, this.otherFlies);
  } 


  // Controls movemnt of the pray mantis object
  /*
  moveMantis() {
      this.mantis.setX(this.mantis.x + 5);
      this.mantis.setY(this.mantis.y + 3)
  }
  */

  /* ex. +20
  gainpoints(points: number){
    this.add.text();
  }
*/

  //spawn in feed spot randomly
  spawnFeedSpot(){
    var feedSpotCount = 1;
    for (var i = 0; i <= feedSpotCount; i++){
      var feedSpot = this.physics.add.sprite(100,105,"feedSpot");
      this.feedSpots.add(feedSpot);
      feedSpot.setRandomPosition(0,0,this.scale.width, 0);
      feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  //flyspawner
  spawnFlies(){
    var flyCount = 1;
    for (var i =0; i<= flyCount; i++){
      var fly = this.physics.add.sprite(100,105,"player");
      this.otherFlies.add(fly);
      fly.setRandomPosition(0,0,this.scale.width, 0);
      fly.setVelocity(0,this.OBSTACLE_VELOCITY);
      
	    fly.body.immovable = true;
    }
  }

  /*
  //spawns praying mantis
  spawnMantis(){
    var feedSpotCount = 1;
    for (var i =0; i<= feedSpotCount; i++){
      var fly = this.physics.add.sprite(100,105,"player");
      this.otherFlies.add(fly);
      fly.setRandomPosition(0,0,this.scale.width, 0);
      fly.setVelocity(0,this.OBSTACLE_VELOCITY);
      
	    fly.body.immovable = true;
    }
  }
  */

  //updates actual timer
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

  updateScore(num: number){
    this.score += num;
    this.scoreText.text = "Score: " + this.score;
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

  //lays eggs when in feed zone
  layEggs(){
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.active){
      console.log("EGG");
      this.updateScore(12);
      for (var i = 0; i <= 3; i++){
        var egg = this.physics.add.sprite(22, 30, "egg");
        this.eggGroup.add(egg);
        egg.setRandomPosition(this.player.x, this.player.y, 40, 41);
        egg.setVelocity(0, this.OBSTACLE_VELOCITY);
      }
    }
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