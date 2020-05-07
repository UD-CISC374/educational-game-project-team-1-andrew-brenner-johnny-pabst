
export default class titleScene extends Phaser.Scene {
    background: Phaser.GameObjects.Image;
    startButton: Phaser.GameObjects.Image;

    constructor() {
        super({ key: 'titleScene' });
      }
    
    create(){
        this.background = this.add.image(0,0,"titleScreen");
        this.background.setOrigin(0,0);

        //create startButton
        this.startButton = this.add.image(400, this.scale.height / 2 + 300, "titleStart");
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', this.startGame, this);
        this.startButton.on('pointerup', this.mouseFix, this);
        this.startButton.on('pointerout', this.mouseFix, this);
    }
    
    update(){
    
    }

    startGame(){
        this.scene.start("flyoverScene");
    }
    //prevents click crash
    mouseFix() {
        
    }
}