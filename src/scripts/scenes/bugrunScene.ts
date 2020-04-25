import { gameSettings } from "../game";
import { flags } from "../game";

export default class bugrunScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  //mantis: Phaser.GameObjects.Sprite;
  obstacles: Phaser.Physics.Arcade.Group;
  //feedSpot: Phaser.GameObjects.Sprite;
  feedSpots: Phaser.Physics.Arcade.Group;
  eggGroup: Phaser.Physics.Arcade.Group;
  otherFlies: Phaser.Physics.Arcade.Group;
  timeInSeconds: number;
  timeText: Phaser.GameObjects.Text;
  timeNum: number;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  OBSTACLE_VELOCITY: number = 120;
  bottomBounds: Phaser.Physics.Arcade.Image;
  playerBottomBounds: Phaser.Physics.Arcade.Image;
  messageBox: Phaser.GameObjects.Sprite;
  closeButton: Phaser.GameObjects.Sprite;
  tutorialMsg: Phaser.GameObjects.Text;
  tutorialBox: Phaser.Physics.Arcade.Group;
  //pesticide: Phaser.GameObjects.Sprite;

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

    if(!flags.bugRunTutDone){
      //create popup
      this.messageBox = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "messageBox");
      this.closeButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
      this.tutorialMsg = this.add.text(this.scale.width / 8 , this.scale.height / 3, 'Rack up points by infesting the area!\nPress Spacebar over feedspots to lay eggs.\nKeep up and avoid pesticide and predators', { font: "30px Arial", fill: "#000000", align: "center" });
      this.tutorialBox = this.physics.add.group();
      this.closeButton.setInteractive();
      this.closeButton.on('pointerdown', this.destroyTutorial, this);
      this.closeButton.on('pointerup', this.mouseFix, this);
      this.closeButton.on('pointerout', this.mouseFix, this);
      flags.bugRunTutDone = true;
    }

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
        // spawning praying mantis
    this.time.addEvent({
      delay:10000,
      callback:this.spawnMantis,
      callbackScope:this,
      loop: true
    })
    //spawn pesticide
    this.time.addEvent({
      delay:9000,
      callback:this.spawnPesticide,
      callbackScope:this,
      loop: true
    })




    // player collides with other flies
    this.physics.add.collider(this.player, this.otherFlies);
    // praying Mantis collides into player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, undefined, this);
    //player lays eggs on feed spot
    this.physics.add.overlap(this.player, this.feedSpots, this.layEggs, undefined, this);

    // adding bottom bounds
    this.bottomBounds = this.physics.add.image(0, this.scale.height + 200, "bottomBounds");
    this.bottomBounds.setImmovable(true);
    // Colliders for obstacles and bottomBounds
    this.physics.add.collider(this.bottomBounds, this.otherFlies, function(bottomBounds, fly){
      fly.destroy();
    }, undefined, this);
    this.physics.add.collider(this.bottomBounds, this.feedSpots, function(bottomBounds, feedSpot){
      feedSpot.destroy();
    }, undefined, this);
    this.physics.add.collider(this.bottomBounds, this.eggGroup, function(bottomBounds, egg){
      egg.destroy();
    }, undefined, this);
    this.physics.add.collider(this.bottomBounds, this.obstacles, function(bottomBounds, obstacle){
      obstacle.destroy();
    }, undefined, this);
    
    // bottom bounds specifically for player
    this.playerBottomBounds = this.physics.add.image(0, this.scale.height, "bottomBounds");
    this.playerBottomBounds.setImmovable(true);
    this.physics.add.collider(this.playerBottomBounds, this.player, this.killBug, undefined, this);
  }



  update() {
    this.background.tilePositionY -= 2; // scroll background
    this.movePlayerManager(); // listen for player movement
  } 

  /* ex. +20
  gainpoints(points: number){
    this.add.text();
  }
*/
  



  //spawn in feed spot randomly
  spawnFeedSpot(){
    var feedSpotCount = 2;
    for (var i = 0; i < feedSpotCount; i++){
      var feedSpot = this.physics.add.sprite(100,105,"feedSpot");
      this.feedSpots.add(feedSpot);
      feedSpot.setRandomPosition(-50,-50,this.scale.width, 0);
      feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  //flyspawner
  spawnFlies(){
    var flyCount = 3;
    for (var i =0; i < flyCount; i++){
      var fly = this.physics.add.sprite(100,105,"player");
      this.otherFlies.add(fly);
      fly.setRandomPosition(-50,-50,this.scale.width, 0);
      fly.setVelocity(0,this.OBSTACLE_VELOCITY);
      
	    fly.body.immovable = true;
    }
  }


  //spawns praying mantis
  spawnMantis(){
    var mantisCount = 1;
    for (var i =0; i < mantisCount; i++){
      var mantis = this.physics.add.sprite(100,105,"mantisMoveRight");
      mantis.play("mantisMoveRight");
      this.obstacles.add(mantis);
      mantis.setRandomPosition(-50,-50,this.scale.width / 2, 0);
      mantis.setVelocity(50,this.OBSTACLE_VELOCITY);
      mantis.body.setSize(200,200);
    }
  }

  //spawn pesticide
  spawnPesticide(){
    var pesticideCount = 1;
    for (var i =0; i < pesticideCount; i++){
      var pesticide = this.physics.add.sprite(0,0,"pesticideWarning");
      pesticide.play("pesticideWarning");
      //this.obstacles.add(pesticide);
      pesticide.setRandomPosition(0,0,this.scale.width, this.scale.height / 3);
      pesticide.setVelocity(0,this.OBSTACLE_VELOCITY);
      this.time.addEvent({
        delay:1500,
        callback:this.pesticideSwitch,
        args: [pesticide],
        callbackScope:this,
        loop: false
      })
      
    }
  }
  pesticideSwitch(pesticide){
    pesticide.play("pesticideZone");
    this.obstacles.add(pesticide);
    pesticide.setVelocity(0,this.OBSTACLE_VELOCITY);
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
    if (num < 0){
      var pointsPopup = this.add.text(this.player.x, this.player.y - 50, num.toString(), { font: "50px Arial", fill: "#ff0000", align: "center" });
      this.time.addEvent({
        delay:1000,
        callback: this.pointDestroy,
        args: [pointsPopup],
        callbackScope: this,
        loop: false
      });
    } else {
      var pointsPopup = this.add.text(this.player.x, this.player.y - 50, "+" + num.toString(), { font: "50px Arial", fill: "#00ff00", align: "center" });
      this.time.addEvent({
        delay:1000,
        callback: this.pointDestroy,
        args: [pointsPopup],
        callbackScope: this,
        loop: false
      });
    }
    if (this.score + num >= 0){
      this.score += num;
      this.scoreText.text = "Score: " + this.score;
    }
  }
  pointDestroy(pointsPopup){
    pointsPopup.destroy();
  }

  //despawn bug and delay before reset
  killBug(){
    this.player.disableBody(true, true);
    console.log("collision");
    this.updateScore(-15);
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
      this.updateScore(20);
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
