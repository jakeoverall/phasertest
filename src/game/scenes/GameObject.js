import { EventEmitter } from "./EventEmitter";
import { GAMEOBJECTEVENTS } from "./GAMEOBJECTEVENTS";
export class GameObject extends EventEmitter {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.renderable = null;
    this.active = false;
  }

  update() {
    if (this.renderable) {
      this.x = this.renderable.x;
      this.y = this.renderable.y;
      this.height = this.renderable.height;
      this.width = this.renderable.width;
    }
  }

  destroy(delay = 0) {
    this.active = false;
    setTimeout(() => {
      if (this.renderable) {
        this.renderable.destroy();
        this.emit(GAMEOBJECTEVENTS.DESTROYED, this);
      }
    }, delay);
  }

  addChildNode(node) {
    node.parent = this;
    node.gameObject = node.gameObject || new GameObject();
    node.parent.on(GAMEOBJECTEVENTS.DESTROYED, () => node.gameObject.destroy());
  }
}
