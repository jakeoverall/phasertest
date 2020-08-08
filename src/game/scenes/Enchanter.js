import { Scene } from "phaser";
import beeTexture from '../assets/bee.png';
import bg1Texture from '../assets/bg-1.png';
import bg2Texture from '../assets/bg-2.png';
import groundTexture from '../assets/ground.png';
import tilemapTexture from '../assets/tiled/cobbleset-64.png';
import { FloatingNumbersPlugin } from "../plugins/FloatingNumbersPlugin";
import { Enemy } from "./Enemy";
import { ENV } from "./ENV";
import { GAMEOBJECTEVENTS } from "./GAMEOBJECTEVENTS";
import { Mathf } from "./Mathf";




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
    this.load.image("mapTexture", tilemapTexture);
    this.load.tilemapTiledJSON('mapJSON', 'tile-test.json')
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
    // this.bg_1 = this.add.tileSprite(0, 0, w, h, "bg_1");
    // // Set its pivot to the top left corner
    // this.bg_1.setOrigin(0, 0);
    // // fix it so it won't move when the camera moves.
    // // Instead we are moving its texture on the update
    // this.bg_1.setScrollFactor(0);

    // // Add a second background layer. Repeat as in bg_1
    // this.bg_2 = this.add.tileSprite(0, 0, w, h, "bg_2");
    // this.bg_2.setOrigin(0, 0);
    // this.bg_2.setScrollFactor(0);

    // // add the ground layer which is only 48 pixels tall
    // this.ground = this.add.tileSprite(0, 0, w, 48, "ground");
    // this.ground.setOrigin(0, 0);
    // this.ground.setScrollFactor(0);
    // this.ground.y = 400;
    // const backgroundImage = this.add.image(0, 0, 'bg_1').setOrigin(0, 0);
    // backgroundImage.setScale(2, 0.8);
    this.map = this.make.tilemap({ key: 'mapJSON' })
    const tileset = this.map.addTilesetImage('cobbleset-64', 'mapTexture');
    const platforms = this.map.createStaticLayer('ground', tileset, 0, 0);



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

    // allow key inputs to control the player
    this.cursors = this.input.keyboard.createCursorKeys();

    // making the camera follow the player
    this.cameras.main.roundPixels = true;

    window.cam = this.cameras.main;
    this.mainCam = this.cameras.main;

    this.cameras.main.setZoom(2.5);

    this.enemyManager = new EnemyManager(this)
    this.enemyManager.spawnNextEnemy()
    this.gameObjects = [...this.enemyManager.enemies]
  }

  update() {
    // this.bg_1.tilePositionX = this.mainCam.scrollX * .3;
    // this.bg_2.tilePositionX = this.mainCam.scrollX * .6;
    // this.ground.tilePositionX = this.mainCam.scrollX;

    for (let i = 0; i < this.enemyManager.enemies.length; i++) {
      try {
        const go = this.enemyManager.enemies[i];
        if (go.active) {
          go.update()
        }
      } catch (e) { $log(e) }
    }

  }
}
var s = 1
class EnemyManager {
  /**
   * @param {Scene} scene
   * @param {undefined} [enemies]
   */
  constructor(scene, enemies) {
    this.enemies = [
      new Enemy("BARRY BEE", "bee", 100, 60, "fly"),
      new Enemy("BARNEY BEE", "bee", 200, 60, "fly"),
      new Enemy("BETTY BEE", "bee", 300, 60, "fly"),
      new Enemy("BECKY BEE", "bee", 500, 60, "fly")
    ]
    this.scene = scene
    this.cam = this.scene.cameras.main
    this.enemies.forEach(enemy => {
      enemy.on(GAMEOBJECTEVENTS.DESTROYED, () => {
        this.enemies.splice(this.enemies.indexOf(enemy), 1)
        this.spawnNextEnemy()
      })
    });
  }

  spawnNextEnemy() {
    let next = this.enemies[0]
    if (!next) {
      this.cam.fade(4500)
      this.scene.add.text(-100, this.cam.y, "CONGRATS YOU MURDERED SOME BEES")
      return console.log("YOU WIN!!!")
    }
    next.addToScene(this.scene, Mathf.clamp(Math.random() * 100, 10, 600), Mathf.clamp(Math.random() * 2, 10, 800))
    this.cam.startFollow(next.sprite)
    next.sprite.on("pointerdown", () => this.handleClick(next))
    next.sprite.scale = s
    s++
  }

  /**
   * @param {Enemy} target
   * @param {IArguments} [args]
   */
  handleClick(target, args) {
    if (!floatingNumbers) {
      // @ts-ignore
      floatingNumbers = this.scene.floatingNumbers
    }
    if (target instanceof Enemy) {
      target.onDamage()
      if (target.dead) { return }
      floatingNumbers.createFloatingText({
        textOptions: {
          fontFamily: 'shrewsbury',
          fontSize: 32,
          color: "#ff0000",
          strokeThickness: 2,
          fontWeight: "bold",
          stroke: "#000000",
          shadow: {
            offsetX: 0,
            offsetY: 0,
            color: '#000',
            blur: 4,
            stroke: true,
            fill: false
          }
        },
        text: PLAYER.ATTACKSTRENGTH,
        align: "top-center",
        parentObject: target.sprite,
        animation: "smoke",
        animationEase: "Linear"
      });
      this.scene.mainCam.shake(350, .0015)
      target.sprite.tint = 0xff0000;
      target.active = false
      setTimeout(() => {
        target.active = true
        target.sprite.tint = 0xffffff;
      }, 350)
    }
  }

}