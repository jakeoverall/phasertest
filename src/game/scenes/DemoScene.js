import { Scene } from "phaser";
import dude from '..//assets/dude.png';
import map from '../assets/map.png';



export default class DemoScene extends Scene {
  constructor() {
    super({ key: 'DemoScene' })
  }

  preload() {
    // IMAGES
    this.load.image('map', map);
    this.load.image('ship', dude);
  }

  create() {
    window.scrollSpeed = 350
    let w = 1024
    let h = 2048
    this.cameras.main.setBounds(0, 0, w, h);
    this.grid = this.add.grid(0, 0, w, h, 32, 32, 0xffff00, .5, 0xff00ff, 1)
    this.bg = this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1);
    // this.cursors = this.input.keyboard.createCursorKeys();
    this.ship = this.physics.add.image(400.5, 301.3, 'ship');

    // ship = this.add.image(400.5, 301.3, 'ship');

    // this.cameras.main.startFollow(ship, true, 0.09, 0.09);
    this.cameras.main.roundPixels = true;

    window.cam = this.cameras.main;
    window.panning = false
    this.cameras.main.setZoom(2);
    this.handleMouseInput()

    window.textElem = this.add.text(10, 10, 'x: 0, y:0', { font: '16px Courier', fill: '#00ff00' });
    window.scene = this
  }

  update() {
    if (window.panning) {
      if (this.origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        this.cameras.main.scrollX +=
          this.origDragPoint.x - this.input.activePointer.position.x;
        this.cameras.main.scrollY +=
          this.origDragPoint.y - this.input.activePointer.position.y;
      } // set new drag origin to current position
      this.origDragPoint = this.input.activePointer.position.clone();
    } else {
      this.origDragPoint = null;
    }
  }


  handleMouseInput() {
    this.input.on('wheel', this.handleMouseZoom, this)

    this.input.on('mouseout', function () {
      window.panning = false
      console.log('pointer out')
    })

    this.input.on('pointerdown', function (pointer) {
      if (pointer.event.button == 0) {

      }
      if (pointer.event.button == 1) {
        pointer.event.preventDefault();
        pointer.event.stopPropagation();
        window.panning = true
      }
    });
    this.input.on('pointerup', function (pointer) {
      if (pointer.event.button == 1) {
        window.panning = false
      }
    });
  }

  handleMouseZoom(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    pointer.event.preventDefault()
    let cam = this.cameras.main;
    let zoom = cam.zoom
    if (deltaY > 0) {
      zoom += 1
    } else {
      zoom -= 1
    }
    zoom = this.clamp(zoom, 1, 15)
    cam.zoomTo(zoom, window.scrollSpeed / zoom)
  }

  clamp(val, low, high) {
    val = Math.round(val)
    if (val < low) {
      return low
    }
    if (val > high) {
      return high
    }
    return val
  }

}


