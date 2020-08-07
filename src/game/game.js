import Phaser from 'phaser';
import Enchanter from './scenes/Enchanter';


function launch(containerId) {

    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        disableContextMenu: true,
        scale: {
            // mode: Phaser.Scale.FIT,
            // parent: containerId,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1068,
            height: 600
        },
        scene: [Enchanter]
    })
}

export default launch
export { launch };

