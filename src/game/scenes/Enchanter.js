import { Scene } from "phaser";
import beeTexture from '../assets/bee.png';
import bg1Texture from '../assets/bg-1.png';
import bg2Texture from '../assets/bg-2.png';
import groundTexture from '../assets/ground.png';
import { FloatingNumbersPlugin } from "../plugins/FloatingNumbersPlugin";
import { Enemy } from "./Enemy";
import { ENV } from "./ENV";

function $log() {
  if (ENV.DEBUG) {
    console.log(arguments)
  }
}

export const GLOBALSTYLES = {
  font: {
    font: "20px monospace",
    fill: "#fff"
  },
}
export const PLAYER = {
  ATTACKSTRENGTH: 10
}
/** @type {FloatingNumbersPlugin} */
export let floatingNumbers = null


export default class Enchanter extends Scene {
  constructor() {
    super({ key: 'Enchanter' })
  }

  preload() {
    // IMAGES
    this.load.image("bg_1", bg1Texture);
    this.load.image("bg_2", bg2Texture);
    this.load.image("ground", groundTexture);
    // load spritesheet
    this.load.spritesheet("bee", beeTexture, {
      frameWidth: 37,
      frameHeight: 39
    });
    this.floatingNumbersPlugin = this.load.scenePlugin('floatingNumbersPlugin', FloatingNumbersPlugin, 'floatingNumbersPlugin', 'floatingNumbers');
  }

  create() {
    let w = 1068
    let h = 600
    window.stage = this
    // this.cameras.main.setBounds(0, 0, w, h);
    this.bg_1 = this.add.tileSprite(0, 0, w, h, "bg_1");
    // Set its pivot to the top left corner
    this.bg_1.setOrigin(0, 0);
    // fix it so it won't move when the camera moves.
    // Instead we are moving its texture on the update
    this.bg_1.setScrollFactor(0);

    // Add a second background layer. Repeat as in bg_1
    this.bg_2 = this.add.tileSprite(0, 0, w, h, "bg_2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);

    // add the ground layer which is only 48 pixels tall
    this.ground = this.add.tileSprite(0, 0, w, 48, "ground");
    this.ground.setOrigin(0, 0);
    this.ground.setScrollFactor(0);
    // sinc this tile is shorter I positioned it at the bottom of he screen
    // this.ground.y = 12 * 16;

    // add player
    // this.bee = this.add.sprite(w * 1.5, h / 2, "bee");
    // this.bee.setInteractive()
    // create an animation for the player
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bee", {}),
      frameRate: 20,
      repeat: -1
    });
    // this.bee.play("fly");

    this.bee = new Enemy("BARRY BEE", "bee", 100, 60, "fly")
    this.bee.addToScene(this, w * 1.5, h / 2)

    // allow key inputs to control the player
    this.cursors = this.input.keyboard.createCursorKeys();

    // making the camera follow the player
    this.cameras.main.startFollow(this.bee.sprite)
    this.cameras.main.roundPixels = true;

    window.cam = this.cameras.main;
    this.mainCam = this.cameras.main;


    this.cameras.main.setZoom(2);
    this.textElem = this.add.text(10, 10, 'x: 0, y:0', { font: '16px Courier', fill: '#00ff00' });

    this.bee.sprite.on('pointerdown', () => this.handleClick(this.bee, arguments), this)
    this.gameObjects = [this.bee]
  }

  update() {
    this.bg_1.tilePositionX = this.mainCam.scrollX * .3;
    this.bg_2.tilePositionX = this.mainCam.scrollX * .6;
    this.ground.tilePositionX = this.mainCam.scrollX;

    for (let i = 0; i < this.gameObjects.length; i++) {
      try {
        const go = this.gameObjects[i];
        if (go.active) {
          go.update()
        }
      } catch (e) { $log(e) }
    }

  }

  /**
   * @param {Enemy} target
   * @param {IArguments} args
   */
  handleClick(target, args) {
    if (!floatingNumbers) {
      // @ts-ignore
      floatingNumbers = this.floatingNumbers
    }
    if (target instanceof Enemy) {
      target.onDamage()
    }
  }

}

