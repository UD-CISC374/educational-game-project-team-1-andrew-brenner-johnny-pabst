import 'phaser';
import PreloadScene from './scenes/preloadScene';
import GameConfig = Phaser.Types.Core.GameConfig;
import flyoverScene from './scenes/flyoverScene';
import bugrunScene from './scenes/bugrunScene';
import bugrunTutorialScene from './scenes/bugRunTutorialScene';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 800;



export const gameSettings = {
    playerSpeed: 200,
}

export var flags = {
    flyoverTutDone: true,
    bugRunTutDone: false,
    appleTreeDead: true,
    cherryTreeDead: false,
    grapeVineDead: false,
    treeOfHeavenDead: false,
    blackWalnutDead: false,
    latestHost: "Apple Tree"
}

const config: GameConfig = {
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, flyoverScene, bugrunScene, bugrunTutorialScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};

window.addEventListener('load', () => {
    window['game'] = new Phaser.Game(config);
});


