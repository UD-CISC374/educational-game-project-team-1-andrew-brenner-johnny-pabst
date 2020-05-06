import { gameSettings } from "../game";
import { flags } from "../game";

export default class bugrunScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  obstacles: Phaser.Physics.Arcade.Group;
  eggZones: Phaser.Physics.Arcade.Group;
  feedSpots: Phaser.Physics.Arcade.Group;
  eggGroup: Phaser.Physics.Arcade.Group;
  otherFlies: Phaser.Physics.Arcade.Group;
  timeInSeconds: number;
  timeText: Phaser.GameObjects.Text;
  timeNum: number = 60;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  OBSTACLE_VELOCITY: number = 120;
  bottomBounds: Phaser.Physics.Arcade.Image;
  playerBottomBounds: Phaser.Physics.Arcade.Image;
  music: Phaser.Sound.BaseSound;
  pop: Phaser.Sound.BaseSound;
  spray: Phaser.Sound.BaseSound;
  munch: Phaser.Sound.BaseSound;
  death: Phaser.Sound.BaseSound;
  messageBox: Phaser.GameObjects.Image;
  closeButton: Phaser.GameObjects.Image;
  boss: Phaser.GameObjects.Image;
  modalMsg: Phaser.GameObjects.Text;
  timeTimer: Phaser.Time.TimerEvent;
  feedZoneTimer: Phaser.Time.TimerEvent;
  eggZoneTimer: Phaser.Time.TimerEvent;
  otherFliesTimer: Phaser.Time.TimerEvent;
  prayingMantisTimer: Phaser.Time.TimerEvent;
  pesticideTimer: Phaser.Time.TimerEvent;


  constructor() {
    super({ key: 'bugrunScene' });
  }

  create() {
    // create background
    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "bugrunBackground");
    this.background.setOrigin(0,0);


    //load in music
    this.music = this.sound.add("bugBoogie");
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

    //initialize sounds effects
    this.pop = this.sound.add("pop");
    this.munch = this.sound.add("munch");
    this.spray = this.sound.add("spray");
    this.death = this.sound.add("death");

    //create timer
    this.timeText = this.add.text(0, this.scale.height - 36, 'Time Remaining: ' + this.timeNum, { font: "32px Arial", fill: "#ffffff", align: "left" });

    //create score
    this.score = 0;
    this.scoreText = this.add.text(0, this.scale.height - 72, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "left" });

    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
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
    //create group for eggzones
    this.eggZones = this.physics.add.group();
    //create group for eggs
    this.eggGroup = this.physics.add.group();
    
    // ** TIMED EVENTS **
    //timer
    this.timeTimer = this.time.addEvent({
      delay:1000,
      callback:this.updateTimeText,
      callbackScope:this,
      loop: true,
      paused: false
    })

    // spawning feed spots
    this.feedZoneTimer = this.time.addEvent({
      delay:18000,
      callback:this.spawnFeedZone,
      callbackScope:this,
      loop: true
    })
    // spawning egg Zones
    this.eggZoneTimer = this.time.addEvent({
      delay:15000,
      callback:this.spawnEggZone,
      callbackScope:this,
      loop: true
    })
    // spawning other flies
    this.otherFliesTimer = this.time.addEvent({
      delay:1000,
      callback:this.spawnFlies,
      callbackScope:this,
      loop: true
    })
        // spawning praying mantis
    this.prayingMantisTimer = this.time.addEvent({
      delay:10000,
      callback:this.spawnMantis,
      callbackScope:this,
      loop: true
    })
    //spawn pesticide
    this.pesticideTimer = this.time.addEvent({
      delay:9000,
      callback:this.spawnPesticide,
      callbackScope:this,
      loop: true
    })




    // player collides with other flies
    this.physics.add.collider(this.player, this.otherFlies);
    // praying Mantis collides into player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, undefined, this);
    //player latches onto feed spot
    this.physics.add.overlap(this.player, this.feedSpots, this.eatFood, undefined, this);
    //player lays eggs on egg zone
    this.physics.add.overlap(this.player, this.eggZones, this.layEggs, undefined, this);

    //obstacles destroy other flies
    this.physics.add.overlap(this.obstacles, this.otherFlies, function(obstacle, fly){
      obstacle.removeInteractive();
      fly.destroy();
    }, undefined, this);
    // adding bottom bounds
    this.bottomBounds = this.physics.add.image(0, this.scale.height + 200, "bottomBounds");
    this.bottomBounds.setImmovable(true);
    // Colliders for obstacles and bottomBounds
    this.physics.add.collider(this.bottomBounds, this.otherFlies, function(bottomBounds, fly){
      fly.destroy();
    }, undefined, this);
    this.physics.add.collider(this.bottomBounds, this.eggZones, function(bottomBounds, eggZone){
      eggZone.destroy();
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

  /**
  * Creates a pop-up message box, may need to include paramters for text x,y
  * message: the text in the pop-up box
  */
  createMessageBox(message: string){
    this.messageBox = this.add.image(this.scale.width / 2, this.scale.height / 2, "messageBox");
    this.closeButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
    this.boss = this.add.image(this.scale.width / 4 - 20, this.scale.height / 2 - 20, "buzzCapone");
    this.modalMsg = this.add.text(this.scale.width / 4 + 75, this.scale.height / 3 + 20, message, { font: "20px Arial", fill: "#000000", align: "left" });
    this.closeButton.setInteractive();
    this.closeButton.on('pointerdown', this.destroyMessageBox, this);
    this.closeButton.on('pointerup', this.mouseFix, this);
    this.closeButton.on('pointerout', this.mouseFix, this);
   }

     //close message box
  destroyMessageBox(){
    console.log("Message box removed");
    this.modalMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
    this.boss.destroy();
    this.scene.start('flyoverScene');
  }

  //fixes click event crash
  mouseFix(){}




  //spawn in feed spot randomly
  spawnFeedZone(){
    var feedSpotCount = 2;
    for (var i = 0; i < feedSpotCount; i++){
      var feedSpot = this.physics.add.image(100,105,"feedSpot");
      this.feedSpots.add(feedSpot);
      feedSpot.setRandomPosition(0,-50,this.scale.width, 0);
      feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }
  //spawn in egg zone randomly
  spawnEggZone(){
    var eggZoneCount = 1;
    for (var i = 0; i < eggZoneCount; i++){
      var eggZone = this.physics.add.image(100,105,"eggZone");
      this.eggZones.add(eggZone);
      eggZone.setRandomPosition(0,-50,this.scale.width, 0);
      eggZone.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  //flyspawner
  spawnFlies(){
    var flyCount = 3;
    for (var i =0; i < flyCount; i++){
      var fly = this.physics.add.sprite(41,45,"dummy");
      this.otherFlies.add(fly);
      fly.setRandomPosition(0,-50,this.scale.width, 0);
      fly.setVelocity(0,this.OBSTACLE_VELOCITY);
      
	    fly.body.immovable = true;
    }
  }


  //spawns praying mantis
  // 50/50 chance it spawns on the left side moving right or vice versa
  spawnMantis(){

    if(Math.random() < 0.5){
      var mantis = this.physics.add.sprite(-50, -50, "mantisMoveRight");
      mantis.play("mantisMoveRight");
      this.obstacles.add(mantis);
      //mantis.setRandomPosition(-50, -50, this.scale.width / 2, 0);
      mantis.setVelocity(50, this.OBSTACLE_VELOCITY);

    } else{
      var mantis = this.physics.add.sprite(this.scale.width + 50, -50, "mantisMoveLeft");
      mantis.play("mantisMoveLeft");
      this.obstacles.add(mantis);
      mantis.setVelocity(-50, this.OBSTACLE_VELOCITY);
    }

    mantis.body.setSize(200, 200); //adjusts bounding box (hitbox)
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
    this.spray.play();
    this.obstacles.add(pesticide);
    pesticide.setVelocity(0,this.OBSTACLE_VELOCITY);
  }

  //updates actual timer
  updateTimeText(){
    //console.log(this.timeNum);
    if (this.timeNum > 0) {
      this.timeNum--;
      this.timeText.text = "Time Remaining: " + this.timeNum;
    }
    else{
      this.sound.remove(this.music);
      this.stopAll();
      this.createMessageBox("Way to go kid!\n This tree is just about dead now.\n Let's find a new one.");
    }
  }

  /**
   * stopAll
   * removes all timers spawning obstacles and freezes all obstacles currently on-screen
   */
  stopAll(){
    this.sound.remove(this.music);
    this.resetPlayer();
    this.feedZoneTimer.remove();
    this.eggZoneTimer.remove();
    this.otherFliesTimer.remove();
    this.prayingMantisTimer.remove();
    this.pesticideTimer.remove();
    this.obstacles.setVelocity(0,0);
    this.otherFlies.setVelocity(0,0);
    this.feedSpots.setVelocity(0,0);
    this.eggZones.setVelocity(0,0);
    this.eggGroup.setVelocity(0,0);
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
    //console.log("collision");
    this.death.play();
    this.updateScore(-15);
    this.time.addEvent({
      delay:1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  //latch onto foodspot when pressed spacebar
  eatFood(){
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.active){
      console.log("EAT");
      this.munch.play();
      this.updateScore(100);
      this.player.disableBody(true,true);
      var dummy = this.physics.add.sprite(this.player.x, this.player.y, "dummy");
      dummy.setVelocityX(0);
      dummy.setVelocityY(this.OBSTACLE_VELOCITY);
      this.time.addEvent({
        delay:1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      })
    }
  }
  //lays eggs when in feed zone
  layEggs(){
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.active){
      console.log("EGG");
      this.pop.play();
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
    let y = this.scale.height-50;

    this.player.alpha = 0.5;
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
        //console.log("left");
      } else if(this.cursorKeys.right.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
        // console.log("right");
      } else {
        this.player.setVelocityX(0); // stop movement when key is released
      }

      // up and down
      if(this.cursorKeys.up.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed);
        //console.log("up");
      } else if(this.cursorKeys.down.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed);
        //console.log("down");
      } else{
        this.player.setVelocityY(0); // stop movement when key is released
      }
    }
  } 



}

