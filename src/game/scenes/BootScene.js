import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import bomb from '@/game/assets/bomb.png'
import ground from '@/game/assets/platform.png'
import dude from '@/game/assets/dude.png'
import star from '@/game/assets/star.png'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'


export default class BootScene extends Scene {
    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        // IMAGES
        this.load.image('sky', sky)
        this.load.image('bomb', bomb)
        this.load.image('ground', ground);
        this.load.image('star', star);

        // CHARACTERS
        this.load.spritesheet('dude',
            dude,
            { frameWidth: 32, frameHeight: 48 }
        );

        // SOUNDS
        this.load.audio('thud', [thudMp3, thudOgg])
    }

    create() {
        this.scene.start('TestScene')
    }
}