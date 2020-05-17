
export default class endScene extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite;
    startButton: Phaser.GameObjects.Image;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: 'endScene' });
      }
    
    create(){
        this.background = this.add.tileSprite(0,0,this.scale.width, this.scale.height, "endCredits");
        this.background.setOrigin(0,0);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        //create startButton
        this.startButton = this.add.image(400, this.scale.height / 2 + 300, "titleStart");
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', this.restartGame, this);
        this.startButton.on('pointerup', this.mouseFix, this);
        this.startButton.on('pointerout', this.mouseFix, this);
    }
    
    update(){
        this.background.tilePositionY += 0.8; // scroll background
        // If spacebar is pressed -> start game
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.background.destroy();
            this.startButton.destroy();
            this.restartGame();
          }
    }


    restartGame(){
        this.scene.start("titleScene");
    }
    //prevents click crash
    mouseFix() {}
}