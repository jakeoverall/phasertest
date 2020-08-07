import { GameObjects, Scene } from "phaser";
import { COLORS } from "./COLORS";
import { GLOBALSTYLES } from "./Enchanter";
import { GameObject } from "./GameObject";
import { GAMEOBJECTEVENTS } from "./GAMEOBJECTEVENTS";
import { Mathf } from "./Mathf";
/**
 * @typedef {{
 * backgroundColor: number,
 * backgroundOpacity: number,
 * foregroundColor: number,
 * opacity: number,
 * position: "bottom" | "top",
 * offsetY: number,
 * offsetX: number,
 * text: string
 * textColor: number
 * }} HealthbarOptions
 */

export class Healthbar extends GameObjects.Graphics {
  /**
   * @param {Scene} scene
   * @param {GameObject} gameObject
   * @param {Number} [width]
   * @param {Number} [height]
   * @param {HealthbarOptions} [options]
   */
  constructor(scene, gameObject, width = 50, height = 15, options = {
    backgroundColor: COLORS.BLACK, backgroundOpacity: .35, foregroundColor: COLORS.GREEN, opacity: 1, position: "bottom", offsetY: 20, offsetX: 0, text: "", textColor: COLORS.WHITE
  }) {
    super(scene);
    this.gameObject = gameObject;
    this.height = height;
    this.width = width;
    this.options = options;
    this.percentage = 1;
    this.updatePosition();

    // this.tweenBar = this.scene.tweens.add({
    //   targets: this,
    //   x: this.x,
    //   y: this.y,
    //   paused: false,
    //   duration: 10000,
    //   repeatDelay: 0
    // });


    this.text = scene.add.text(this.x + this.width / 2, this.y + this.height, this.options.text, GLOBALSTYLES.font);
    this.text.setFontSize(9);
    this.text.setDepth(1);

    gameObject.on(GAMEOBJECTEVENTS.DESTROYED, () => this.onDestroy());
    scene.add.existing(this);
    this.drawBar();
  }

  /**
   * @param {number} percentage
   */
  setValue(percentage) {
    //scale the bar
    this.percentage = percentage;
    if (this.percentage < .4) {
      return this.drawBar(COLORS.RED);
    }
    if (this.percentage < .6) {
      return this.drawBar(COLORS.YELLOW);
    }
    return this.drawBar(COLORS.GREEN);
  }

  drawBar(color = this.options.foregroundColor, opacity = this.options.opacity) {
    this.options.foregroundColor = color;
    this.options.opacity = opacity;
    this.clear();

    // this.scaleX = 1
    this.fillStyle(this.options.backgroundColor, this.options.backgroundOpacity);
    this.fillRect(0, 0, this.width, this.height);

    // this.scaleX = currentX
    this.fillStyle(this.options.foregroundColor, this.options.opacity);
    this.fillRect(2, 2, Mathf.clamp((this.width * this.percentage), 0, this.width), this.height - 4);
  }

  update() {
    this.updatePosition();
  }

  updatePosition() {
    this.x = this.gameObject.x - (this.gameObject.width / 2) + this.options.offsetX;
    //this.y = this.gameObject.y - (this.gameObject.height / 2);
    this.y = this.options.position === "bottom" ? this.gameObject.y + this.options.offsetY : this.gameObject.y - this.gameObject.height + this.options.offsetY;
  }

  setText(text = "") {
    if (!this.text) { return }
    this.text.setText(text);
  }

  onDestroy() {
    try {
      this.clear()
      this.destroy(true);
      this.text.destroy(true);
    } catch (e) {
      console.log(e)
    } finally {
      this.text = null
    }
  }

}
