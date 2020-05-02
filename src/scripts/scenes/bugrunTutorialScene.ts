import { gameSettings } from "../game";
import { flags } from "../game";
 
export default class bugrunTutorialScene extends Phaser.Scene {
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
  OBSTACLE_VELOCITY: number = 120;
  bottomBounds: Phaser.Physics.Arcade.Image;
  playerBottomBounds: Phaser.Physics.Arcade.Image;
  messageBox: Phaser.GameObjects.Sprite;
  closeButton: Phaser.GameObjects.Sprite;
  tutorialMsg: Phaser.GameObjects.Text;
  timeTimer: Phaser.Time.TimerEvent;
  feedSpot: Phaser.Physics.Arcade.Image;
  arrow: Phaser.Physics.Arcade.Sprite;
  eggZone: Phaser.Physics.Arcade.Image;
  mantis: Phaser.Physics.Arcade.Sprite;
  pesticide: Phaser.Physics.Arcade.Sprite;
  spawnFliesTimer: Phaser.Time.TimerEvent;
  music: Phaser.Sound.BaseSound;
  pop: Phaser.Sound.BaseSound;
  spray: Phaser.Sound.BaseSound;
  munch: Phaser.Sound.BaseSound;
  death: Phaser.Sound.BaseSound;
  otherFliesCount: number = 0;



  // FLAGS for tutorial Stages
  messageRead: boolean = false;
  feedSpotTutCompleted: boolean = false;
  eggZoneTutCompleted: boolean = false;
  mantisTutCompleted: boolean = false;
  pesticideTutCompleted: boolean = false;
  feedSpotSpawned: boolean = false;
  eggZoneSpawned: boolean = false;
  feedSpotFrozen: boolean = false;
  eggZoneFrozen: boolean = false;
  feedSpotMoving: boolean = false;
  eggZoneMoving: boolean = false;
  newFlyMsgRead: boolean = false;
  eggZoneCongratsMsgRead: boolean = false;
  mantisMsgRead: boolean = false;
  mantisSpawned: boolean = false;
  mantisFrozen: boolean = false;
  mantisMoving: boolean = false;
  pesticideSpawned: boolean = false;
  pesticideMoving: boolean = false;
  otherFliesTutCompleted: boolean = false;
  otherFliesMsgRead: boolean = false;
  otherFliesSpawning: boolean = false;
  boss: Phaser.GameObjects.Sprite;
  








  constructor() {
    super({ key: 'bugrunTutorialScene' });
  }

  create() {
    // create background
    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "bugrunBackground");
    this.background.setOrigin(0,0);

    //load in music
    this.music = this.sound.add("tutorialJam");
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
    this.timeNum = 120;
    this.timeText = this.add.text(0, this.scale.height - 36, 'Time Remaining: \u221e', { font: "32px Arial", fill: "#ffffff", align: "left" });

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

    // Initial popup
    this.createMessageBox("Hey, kid.\nThe gang really likes this host that you picked out.\nNow let\'s have some fun here, shall we?\nNow that you're on the tree, it's time to EAT!\n\n Our goal here is simple:\nTake over this tree with as MANY flies as possible.");



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
    


    // player collides with other flies
    this.physics.add.collider(this.player, this.otherFlies);
    // praying Mantis collides into player
    this.physics.add.overlap(this.player, this.obstacles, this.killBug, undefined, this);
    //player latches onto feed spot
    this.physics.add.overlap(this.player, this.feedSpots, this.eatFood, undefined, this);
    //player lays eggs on egg zone
    this.physics.add.overlap(this.player, this.eggZones, this.layEggs, undefined, this);



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
    
    if(this.messageRead){ // message box has been closed
      this.background.tilePositionY -= 2; // scroll background
      this.movePlayerManager(); // listen for player movement
      
      if(!this.feedSpotTutCompleted){ /// has not yet completed the feedSpot tutorial 
        this.feedSpotTut();
      } else if(!this.eggZoneTutCompleted) { // has not yet completed the eggZone tutorial
        this.eggZoneTut();
      } else if(!this.mantisTutCompleted){
        this.mantisTut();
      } else if(!this.pesticideTutCompleted){
        this.pesticideTut();
      } else if(!this.otherFliesTutCompleted){
        this.otherFliesTut();
      } else if(this.otherFliesTutCompleted){
        this.sound.remove(this.music);
        this.scene.start('bugrunScene');
      }
    


    } else{ // message box is open
      this.player.setVelocity(0,0);
    }
  } 


  /**
   * creates the messages and objects for the feed spot tutorial
   */
  feedSpotTut(){
    // Part 1
    if(!this.feedSpotSpawned){ 
      // Spawn feedSpot
      this.feedSpot = this.physics.add.image(100,105,"feedSpot");
      this.feedSpots.add(this.feedSpot);
      this.feedSpot.setRandomPosition(0,-50,this.scale.width - 50, 0);
      this.feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
      this.feedSpotSpawned = true;

    // Part 2
    } else if(this.feedSpot.y > 50 && !this.feedSpotFrozen){
      // freeze feedSpot and show message
      this.feedSpot.setVelocityY(0); // freeze feedSpot
      this.createMessageBox('See that yellow sap spot?\nCrawl on it and press SPACEBAR\nTo start eating the sap!');
      this.arrow = this.physics.add.sprite(this.feedSpot.x, this.feedSpot.y + this.feedSpot.height, "arrow");
      this.arrow.play("arrow");
      this.feedSpotFrozen = true;

    // Part 3
    } else if(this.feedSpotFrozen && !this.feedSpotMoving){
      //feedSpot was frozen and NOW should now be moving
      this.arrow.setAlpha(0); // arrow disappears
      this.feedSpot.setVelocity(0, this.OBSTACLE_VELOCITY); // feedSpot now moving
      this.feedSpotMoving = true;
    
    // Part 4
    } else if(this.feedSpot.y > 900){
      // Keep spawning feedSpot until they get the eat it
      this.feedSpot.setRandomPosition(0,-50,this.scale.width - 50, 0);
      this.feedSpot.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  /**
   * creates the messages and objects for the egg zone tutorial
   */
  eggZoneTut(){
    // pop-up immediatedly after feedZone tut is completed
    if(!this.newFlyMsgRead){
      this.createMessageBox("Nice job, kid! This host will be ours in no time!\nWhile that one feeds on the tree,\ntake control of another Spotted Lanternfly!\n\n Let's keep goin\'!");
      this.newFlyMsgRead = true;
    // Part 1
    } else if(!this.eggZoneSpawned){ 
      // Spawn feedSpot
      this.eggZone = this.physics.add.image(100,105,"eggZone");
      this.eggZones.add(this.eggZone);
      this.eggZone.setRandomPosition(0,-50,this.scale.width - 50, 0);
      this.eggZone.setVelocity(0,this.OBSTACLE_VELOCITY);
      this.eggZoneSpawned = true;

    // Part 2
    } else if(this.eggZone.y > 50 && !this.eggZoneFrozen){
      // freeze feedSpot and show message
      this.eggZone.setVelocityY(0); // freeze eggZone
      this.createMessageBox('Now, see that green area?\nCrawl on it and press SPACEBAR to lay eggs!');
      this.arrow = this.physics.add.sprite(this.eggZone.x, this.eggZone.y + this.eggZone.height + 10, "arrow");
      this.arrow.play("arrow");
      this.eggZoneFrozen = true;

    // Part 3
    } else if(this.eggZoneFrozen && !this.eggZoneMoving){
      //feedSpot was frozen and NOW should now be moving
      this.arrow.setAlpha(0); // arrow disappears
      this.eggZone.setVelocity(0, this.OBSTACLE_VELOCITY); // eggZone now moving
      this.eggZoneMoving = true;
    
    // Part 4
    } else if(this.eggZone.y > 900){
    // Keep spawning eggZone until they lay eggs on it
      this.eggZone.setRandomPosition(0,-50,this.scale.width, 0);
      this.eggZone.setVelocity(0,this.OBSTACLE_VELOCITY);
    }
  }

  /**
   * creates the messages and objects for the praying mantis tutorial
   */
  mantisTut(){
    if(!this.eggZoneCongratsMsgRead){
      this.createMessageBox("Great job!\nThe more eggs the better!\n");
      this.eggZoneCongratsMsgRead = true;

    // Part 1
    }else if(!this.mantisSpawned){ 
      // Spawn praying mantis
      this.mantis = this.physics.add.sprite(-50,-50,"mantisMoveRight");
      this.mantis.play("mantisMoveRight");
      this.mantis.body.setSize(200, 200); //adjusts bounding box (hitbox)
      this.obstacles.add(this.mantis);
      this.mantis.setVelocity(50, this.OBSTACLE_VELOCITY)
      this.mantisSpawned = true;

    // Part 2
    } else if(this.mantis.y > 50 && !this.mantisFrozen){
      // freeze mantis and show message
      this.mantis.setVelocity(0,0); // freeze mantis
      this.createMessageBox("Woah, look out for that Praying Mantis!\nThey'll eat almost anything.\n\nRun into one and you\'ll be sleepin\' with the fishes.");
      this.arrow = this.physics.add.sprite(this.mantis.x + 10, this.mantis.y + this.mantis.height - 50, "arrow");
      this.arrow.play("arrow");
      this.mantisFrozen = true;
    // Part 3
    } else if(this.mantisFrozen && !this.mantisMoving){
      //mantis was frozen and NOW should now be moving
      this.arrow.setAlpha(0); // arrow disappears
      this.mantis.setVelocity(50, this.OBSTACLE_VELOCITY); // mantis now moving
      this.mantisMoving = true;
    
    // Part 4
    } else if(this.mantis.y > 850){
      // mantis is gone, start next tutorial
      this.mantisTutCompleted = true;
      this.createMessageBox("BEWARE,\nHumans have created a \nsuper weapon called pesticide.\nIt's very deadly and smells kind of funny.");
    }
  }


  /**
   * creates the messages and objects for the pesticide tutorial
   */
  pesticideTut(){
    // Part 1
    if(!this.pesticideSpawned){ 
      // Spawn Pesticide
      this.pesticide = this.physics.add.sprite(0,0,"pesticideWarning");
      this.pesticide.play("pesticideWarning");
      this.obstacles.add(this.pesticide);
      this.pesticide.setRandomPosition(0,0,this.scale.width, this.scale.height / 3);
      //this.pesticide.setVelocity(0,this.OBSTACLE_VELOCITY);
      this.pesticideSpawned = true;
      this.createMessageBox("Incoming!\nWhen you see this warning,\nhumans are about to spray pesticide there!");


    // Part 2
    } else {
      if(!this.pesticideMoving) {
        // set pesticide velocity to normal and "spray"
        this.pesticide.setVelocity(0, this.OBSTACLE_VELOCITY);
        this.time.addEvent({
          delay:1500,
          callback:this.pesticideSwitch,
          args: [this.pesticide],
          callbackScope:this,
          loop: false
        })
        this.pesticideMoving = true;
      } else if(this.pesticide.y > 750) {
        this.pesticideTutCompleted = true;
      } 
    }
  } // end of pesticide tutorial
  

  otherFliesTut(){
    if(!this.otherFliesMsgRead){
      this.createMessageBox("Lastly, crawl around the others still eating.\nIf you can't keep up, you'll get left behind!");
      this.otherFliesMsgRead = true;
    } else if (!this.otherFliesSpawning){
       // spawning other flies
      this.spawnFliesTimer = this.time.addEvent({
        delay:1000,
        callback:this.spawnFlies,
        callbackScope:this,
        loop: true
      })
      this.otherFliesSpawning = true;
      
      // Stop spawning flies after ~15 seconds
    } else{
      if(this.otherFliesCount > 45){
        this.spawnFliesTimer.remove();
        this.otherFliesTutCompleted = true;
        flags.bugRunTutDone = true; 
        this.createMessageBox("Okay, I think you're ready for the Big Leagues, kid!\nLet's FEAST!");
      }
    }
  }


  




/**
 * Creates a pop-up message box, may need to include paramters for text x,y
 * message: the text in the pop-up box
 */
  createMessageBox(message: string){
    // this.messageBox = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "messageBox");
    // this.closeButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
    // this.tutorialMsg = this.add.text(this.scale.width / 17 , this.scale.height / 3, message, { font: "30px Arial", fill: "#000000", align: "center" });
    // this.closeButton.setInteractive();
    // this.closeButton.on('pointerdown', this.destroyMessageBox, this);
    // this.closeButton.on('pointerup', this.mouseFix, this);
    // this.closeButton.on('pointerout', this.mouseFix, this);
    // this.messageRead = false;
    this.messageBox = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "messageBox");
      this.closeButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, "closeButton");
      this.boss = this.add.sprite(this.scale.width / 4 - 20, this.scale.height / 2 - 20, "buzzCapone");
      this.tutorialMsg = this.add.text(this.scale.width / 4 + 75, this.scale.height / 3 + 20, message, { font: "20px Arial", fill: "#000000", align: "left" });
      this.closeButton.setInteractive();
      this.closeButton.on('pointerdown', this.destroyMessageBox, this);
      this.closeButton.on('pointerup', this.mouseFix, this);
      this.closeButton.on('pointerout', this.mouseFix, this);
      this.messageRead = false;
  }

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
      var fly = this.physics.add.sprite(100,105,"dummy");
      this.otherFlies.add(fly);
      fly.setRandomPosition(0,-50,this.scale.width, 0);
      fly.setVelocity(0,this.OBSTACLE_VELOCITY);
      fly.body.immovable = true;
      this.otherFliesCount += 1;
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

  //close tutorial box
  destroyMessageBox(){
    console.log("Message box removed");
    this.tutorialMsg.destroy();
    this.messageBox.destroy();
    this.closeButton.destroy();
    this.boss.destroy();
    this.messageRead = true;
  }

  //fixes click event crash
  mouseFix(){}
  

  //updates actual timer
  updateTimeText(){
    //console.log(this.timeNum);
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
    this.death.play();
    //console.log("collision");
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
      this.feedSpotTutCompleted = true;
      this.updateScore(100);
      this.player.disableBody(true,true);
      this.munch.play();
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
      this.eggZoneTutCompleted = true;
      this.pop.play();
      this.updateScore(20);
      for (var i = 0; i <= 3; i++){
        var egg = this.physics.add.sprite(22, 30, "egg");
        this.eggGroup.add(egg);
        egg.setRandomPosition(this.player.x, this.player.y, 40, 41);
        egg.setVelocity(0, this.OBSTACLE_VELOCITY);
        this.eggZoneTutCompleted = true;
      }
    }
  }

  //reset player position
  resetPlayer(){
    let x = this.scale.width - 400;
    let y = this.scale.height - 30;
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

