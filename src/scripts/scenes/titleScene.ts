
export default class titleScene extends Phaser.Scene {
    background: Phaser.GameObjects.Image;
    startButton: Phaser.GameObjects.Image;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar: Phaser.Input.Keyboard.Key;
    music: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: 'titleScene' });
      }
    
    create(){
        this.background = this.add.image(0,0,"titleScreen");
        this.background.setOrigin(0,0);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //load in music
        this.music = this.sound.add("titleTheme");
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
    
        //create startButton
        this.startButton = this.add.image(400, this.scale.height / 2 + 300, "titleStart");
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', this.startGame, this);
        this.startButton.on('pointerup', this.mouseFix, this);
        this.startButton.on('pointerout', this.mouseFix, this);
    }
    
    update(){
        // If spacebar is pressed -> start game
        if(this.spacebar.isDown){
            this.background.destroy();
            this.startButton.destroy();
            this.startGame();
          }
    }

    startGame(){
        this.sound.remove(this.music);
        this.scene.start("flyoverScene");
    }
    //prevents click crash
    mouseFix() {}
}