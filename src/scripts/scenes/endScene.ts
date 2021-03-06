import { gameSettings } from "../game";
import { flags } from "../game";

export default class endScene extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite;
    resetButton: Phaser.GameObjects.Image;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar: Phaser.Input.Keyboard.Key;
    placeResetTimer: Phaser.Time.TimerEvent;
    music: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: 'endScene' });
      }
    
    create(){
        this.background = this.add.tileSprite(0,0,this.scale.width, this.scale.height, "endCredits");
        this.background.setOrigin(0,0);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //load in music
        this.music = this.sound.add("endCredMusic");
        var musicConfig = {
        mute: false,
        volume: .75,
        rate:1,
        detune:0,
        seek:0,
        loop: false,
        delay: 0
        }
        
        this.music.play(musicConfig);
    
        //create startButton
        this.placeResetTimer = this.time.addEvent({
            delay:14000,
            callback:this.placeReset,
            callbackScope:this,
            loop: true
          })
    }
    
    update(){
        //this.background.tilePositionY += 2; // scroll background
        if (this.background.tilePositionY < 4560){
            this.background.tilePositionY += 1; 
         }
        //console.log(this.background.tilePositionY);
        // If spacebar is pressed -> start game
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.background.destroy();
            this.resetButton.destroy();
            this.restartGame();
          }
    }

    //resets all flags before sending back to title screen
    restartGame(){
        flags.levelsCompleted = 0;
        flags.flyoverTutDone = false;
        flags.bugRunTutDone = false;
        flags.appleTreeDead = false;
        flags.cherryTreeDead = false;
        flags.grapeVineDead = false;
        flags.treeOfHeavenDead = false;
        flags.blackWalnutDead = false;
        flags.latestHost = "";
        gameSettings.totalScore = 0;
        this.sound.remove(this.music);
        this.scene.start("titleScene");
    }
    placeReset(){
        this.resetButton = this.add.image(400, 100, "resetButton");
        this.resetButton.setInteractive();
        this.resetButton.on('pointerdown', this.restartGame, this);
        this.resetButton.on('pointerup', this.mouseFix, this);
        this.resetButton.on('pointerout', this.mouseFix, this);
    }
    //prevents click crash
    mouseFix() {}
}