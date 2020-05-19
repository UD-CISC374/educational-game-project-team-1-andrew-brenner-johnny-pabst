import { gameSettings, flags } from "../game";

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
  timeNum: number;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  OBSTACLE_VELOCITY: number;
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
  msgOpen: boolean;
  stopped: boolean;
  mantisDelay: number;
  pesticideDelay: number;
  feedZoneDelay: number;
  eggZoneDelay: number;
  fliesDelay: number;
  numFlies: number;
  feedZoneCount: number;
  eggZoneCount: number;
  playerInvincible: boolean;
  musicTempo: number;
  requiredScore: number;
  goalLabel: Phaser.GameObjects.Text;
  victory: Phaser.Sound.BaseSound;
  goalReached: Phaser.Sound.BaseSound;
  goal: boolean;
  gameOver: Phaser.Sound.BaseSound;
  timeOver: boolean;



  constructor() {
    super({ key: 'bugrunScene' });
  }

  create() {
    // create background
    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "bugrunBackground");
    this.background.setOrigin(0,0);

    //set speed of all obstacles
    this.OBSTACLE_VELOCITY = 120;

    //load in music
    //music tempo determined by levelscompleted flag
    this.musicTempo = 1 + (flags.levelsCompleted * 1/8);
    this.music = this.sound.add("bugBoogie");
    var musicConfig = {
      mute: false,
      volume: 1,
      rate:this.musicTempo,
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
    this.victory = this.sound.add("victory");
    this.goalReached = this.sound.add("goalReached");
    this.gameOver = this.sound.add("gameover");

    // create player
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.play("playerFly");
    this.player.setCollideWorldBounds(true);

    // set flags
    this.playerInvincible = false;
    this.stopped = false;
    this.msgOpen = false;


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

    console.log(flags.latestHost);
    //** Set up variables depending on level **
    // First Cherry Tree -> Mantis, no Pesticide, avg flies
    // Second Black Walnut -> Pesticide, no Mantis, avg flies
    // Third & Fourth unlocked..
    // GrapeVine -> Mad flies, low pests & mantises
    // AppleTree -> Mad pests & mantises, LOW bugs
    // BOSS Level TOH -> Godspeed :)
    if(flags.latestHost == "cherryTree"){ 
      // No Pesticide, light flies
      this.numFlies = 3; // normal
      this.fliesDelay = 2000 // half the amount
      this.mantisDelay = 8000; // normal 
      this.pesticideDelay = 65000; // Does not spawn
      this.feedZoneDelay = 9000; //  
      this.eggZoneDelay = 11000;
      this.feedZoneCount = 2;
      this.eggZoneCount = 1;
      this.requiredScore = 400;

    } else if(flags.latestHost == "blackWalnut"){
      // No Mantis, light flies
      this.numFlies = 2; // less than level 1
      this.fliesDelay = 2000 // every 2 seconds
      this.mantisDelay = 65000; // does not spawn 
      this.pesticideDelay = 11000; // spawns 5 times total
      this.feedZoneDelay = 8000; // slightly more than level 1
      this.eggZoneDelay = 6000; // slightly more than level 1
      this.feedZoneCount = 1;
      this.eggZoneCount = 1;
      this.requiredScore = 600;
    } else if(flags.latestHost == "grapeVine"){
      // LOTS of flies, few pesticice and Mantis
      this.numFlies = 3;
      this.fliesDelay = 1000;
      this.mantisDelay = 15000;
      this.pesticideDelay = 21000;
      this.feedZoneDelay = 9000;
      this.eggZoneDelay = 11000;
      this.feedZoneCount = 2;
      this.eggZoneCount = 2;
      this.requiredScore = 800;
    } else if(flags.latestHost == "appleTree"){
      // LOTS of pesticide and Mantis, Few flies
      this.numFlies = 2;
      this.fliesDelay = 2000;
      this.mantisDelay = 10000;
      this.pesticideDelay = 14000;
      this.feedZoneDelay = 8000;
      this.eggZoneDelay = 6000;
      this.feedZoneCount = 1;
      this.eggZoneCount = 1;
      this.requiredScore = 800;
    } else if(flags.latestHost == "treeOfHeaven"){
      // Boss Level
      this.numFlies = 3;
      this.fliesDelay = 1000;
      this.mantisDelay = 10000;
      this.pesticideDelay = 14000;
      this.feedZoneDelay = 7000;
      this.eggZoneDelay = 9000;
      this.feedZoneCount = 2;
      this.eggZoneCount = 2;
      this.requiredScore = 1000;
    }


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
      delay:this.feedZoneDelay,
      callback:this.spawnFeedZone,
      callbackScope:this,
      loop: true
    })
    // spawning egg Zones
    this.eggZoneTimer = this.time.addEvent({
      delay:this.eggZoneDelay,
      callback:this.spawnEggZone,
      callbackScope:this,
      loop: true
    })
    // spawning other flies
    this.otherFliesTimer = this.time.addEvent({
      delay:this.fliesDelay,
      callback:this.spawnFlies,
      callbackScope:this,
      loop: true
    })
        // spawning praying mantis
    this.prayingMantisTimer = this.time.addEvent({
      delay:this.mantisDelay,
      callback:this.spawnMantis,
      callbackScope:this,
      loop: true
    })
    //spawn pesticide
    this.pesticideTimer = this.time.addEvent({
      delay:this.pesticideDelay,
      callback:this.spawnPesticide,
      callbackScope:this,
      loop: true
    })

    if(flags.latestHost == "cherryTree"){
      this.pesticideTimer.destroy();
      // No pesticide on first level
    } else if(flags.latestHost == "blackWalnut"){
      this.prayingMantisTimer.destroy();
      // No praying Mantis on second level
    }

    //create score
    this.score = 0;
    this.scoreText = this.add.text(0, this.scale.height - 108, 'Score: ' + this.score, { font: "32px Arial", fill: "#ffffff", align: "left" });

    //create goal score label
    this.goalLabel = this.add.text(0, this.scale.height - 72, 'Goal: ' + this.requiredScore, { font: "32px Arial", fill: "#ffffff", align: "left" });
    this.goal = false; // score goal reached

    //create timer
    this.timeNum = 60;
    this.timeText = this.add.text(0, this.scale.height - 36, 'Time Remaining: ' + this.timeNum, { font: "32px Arial", fill: "#ffffff", align: "left" });
    //timer finish variable
    this.timeOver = false;

    
    
  


    // **  Collisions **
    // player collides with other flies
    this.physics.add.collider(this.player, this.otherFlies);
    // praying Mantis & pesticide overlaps with player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, function(player, obstacle){
      obstacle.destroy();
    }, this);
    //player latches onto feed spot
    this.physics.add.overlap(this.player, this.feedSpots, this.eatFood, undefined, this);
    //player lays eggs on egg zone
    this.physics.add.overlap(this.player, this.eggZones, this.layEggs, undefined, this);

    //obstacles destroy other flies
    this.physics.add.overlap(this.obstacles, this.otherFlies, function(obstacle, fly){
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
  
    //special message box for start of Tree of Heaven level
    if (flags.latestHost == "treeOfHeaven"){
      this.createMessageBox(" Alright, kid. The final tree.\n The Tree of Heaven, this one's our favorite\n My mouth is waterin'...\n Do your thing, kid.");
    }
  }



  update() {
    this.background.tilePositionY -= 2; // scroll background
    this.movePlayerManager(); // listen for player movement

    if(this.msgOpen && this.spacebar.isDown){
      this.destroyMessageBox();
    }
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
    this.msgOpen = true;
   }

     //close message box
  destroyMessageBox(){
    this.modalMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
    this.boss.destroy();
    this.msgOpen = false;
    if (this.score >= this.requiredScore){
      this.timeOver = false;
      this.scene.start('flyoverScene');
    } else if (this.timeOver) {
      this.timeOver = false;
      this.scene.start('bugrunScene');
    }
    //this.scene.start('flyoverScene');
  }
  
  //fixes click event crash
  mouseFix(){}




  //spawn in feed spot randomly
  spawnFeedZone(){
    for (var i = 0; i < this.feedZoneCount; i++){
      var feedSpot = this.physics.add.image(100,105,"feedSpot");
      this.feedSpots.add(feedSpot);
      feedSpot.setRandomPosition(0,-50,this.scale.width, 0);
      feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }
  //spawn in egg zone randomly
  spawnEggZone(){
    for (var i = 0; i < this.eggZoneCount; i++){
      var eggZone = this.physics.add.image(100,105,"eggZone");
      this.eggZones.add(eggZone);
      eggZone.setRandomPosition(0,-50,this.scale.width, 0);
      eggZone.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  //flyspawner
  spawnFlies(){
    for (var i =0; i < this.numFlies; i++){
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

    mantis.body.setSize(100, 100); //adjusts bounding box (hitbox)
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
    pesticide.body.setSize(375, 375);
    pesticide.setVelocity(0,this.OBSTACLE_VELOCITY);
  }

  //updates actual timer
  updateTimeText(){
    if (this.timeNum > 0) {
      this.timeNum--;
      this.timeText.text = "Time Remaining: " + this.timeNum;
    }
    else{
      this.timeOver = true;
      this.sound.remove(this.music);
      this.stopAll();
    }
  }

  /**
   * stopAll
   * removes all timers spawning obstacles and freezes all obstacles currently on-screen
   * adds current bugrun score to total score
   */
  stopAll(){
    if(!this.stopped){
      // gameSettings.totalScore += this.score; // add bugrun score to total
      // flags.levelsCompleted = flags.levelsCompleted + 1;
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
      this.physics.world.colliders.destroy();
      this.stopped = true;
      if(this.score >= this.requiredScore){
        gameSettings.totalScore += this.score; // add bugrun score to total
        flags.levelsCompleted = flags.levelsCompleted + 1;
        this.victory.play();
        if (flags.latestHost == "treeOfHeaven"){
          this.createMessageBox(" HAHAHAHAHA! WE DID IT!\n We've taken over the farm completely...\n");
        }
        else{
          this.createMessageBox(" Way to go kid!\n This tree is just about dead now.\n Let's find a new one.");
        }
        // this.scene.start('flyoverScene');
      }
      else{
        this.gameOver.play();
        this.createMessageBox(" No Kid!\n Ya' didn't do enough to take over the tree.\n Ya' see that number next to 'Goal'?\n Yeah, we need that...\n Let's try this again, shall we?");
      }
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
      if (this.score >= this.requiredScore){
        if (!this.goal){
          this.goalReached.play();
        }
        this.goal = true;
        this.scoreText.setColor("#00ff00");
        this.scoreText.text = "Score: " + this.score;
      }
      else{
        this.goal = false;
        this.scoreText.setColor("#ffffff");
        this.scoreText.text = "Score: " + this.score;
      }
      //this.scoreText.text = "Score: " + this.score;
    }

  }
  pointDestroy(pointsPopup){
    pointsPopup.destroy();
  }

  //respawn bug and delay before reset
  killBug(){
    if(!this.playerInvincible){
      this.player.disableBody(true, true);
      this.death.play();
      this.updateScore(-15);
      this.time.addEvent({
        delay:1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }
  }

  //latch onto foodspot when pressed spacebar
  eatFood(){
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.stopped){
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
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.stopped){
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
    this.playerInvincible = true;
    let x = this.scale.width - 400;
    let y = this.scale.height-50;

    this.player.alpha = 0.5;
    this.player.enableBody(true,x,y,true,true);

    var tween = this.tweens.add({
      targets: this.player,
      y: this.scale.height - 75,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: () => {
        this.player.alpha = 1;
        this.playerInvincible = false;
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
      } else if(this.cursorKeys.right.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
      } else {
        this.player.setVelocityX(0); // stop movement when key is released
      }

      // up and down
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

