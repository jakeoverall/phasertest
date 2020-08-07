import { Scene } from "phaser";
import { floatingNumbers, PLAYER } from "./Enchanter";
import { GameObject } from "./GameObject";
import { Healthbar } from "./Healthbar";
import { Mathf } from "./Mathf";
export class Enemy extends GameObject {
  constructor(name, spriteName, maxHealth, timer, defaultAnimation = "idle") {
    super();
    this.name = name;
    this.spriteName = spriteName;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.timer = timer;
    this.defaultAnimation = defaultAnimation;
  }

  get dead() {
    return this.health <= 0;
  }

  /**
   * @param {Scene} scene
   * @param {number} x
   * @param {number} y
   */
  addToScene(scene, x, y) {
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, this.spriteName);
    this.height = this.sprite.height;
    this.width = this.sprite.width;
    this.sprite.setInteractive();
    this.setAnimation(this.defaultAnimation);
    this.healthBar = new Healthbar(scene, this);
    this.renderable = this.sprite;
    this.sprite.on("update", this.update);
    this.active = true;
  }

  /**
   * @param {string} name
   */
  setAnimation(name) {
    if (!this.scene.anims.get(name)) { return; }
    this.sprite.play(name);
  }

  onDamage() {
    if (!this.active) { return; }
    this.health = Mathf.clamp(this.health - PLAYER.ATTACKSTRENGTH, 0, this.maxHealth);
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
      parentObject: this.sprite,
      animation: "smoke",
      animationEase: "Linear"
    });
    this.healthBar.setValue(this.health / this.maxHealth);
    this.healthBar.setText(`${this.health}/${this.maxHealth}`);
    if (this.dead) {
      this.destroy(350);
    }
  }

  update() {
    super.update();
    this.healthBar.update();
  }
}
