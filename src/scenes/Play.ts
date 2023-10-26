import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  playerShip?: Phaser.GameObjects.Shape;

  moveSpeed = 0.2;
  fireSpeed = 0.3;

  edgePadding = 50;
  playerStartY = 440;

  fired = false;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.playerShip = this.add.rectangle(
      100,
      this.playerStartY,
      50,
      50,
      0x6c3bbf,
    );
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.fired) {
      this.playerShip!.y -= delta * this.fireSpeed;
    } else {
      this.handleInput(delta);
    }

    if (this.playerShip!.y < 0) {
      this.resetShip();
    }
  }

  private handleInput(delta: number) {
    if (this.left!.isDown) {
      this.moveShip(-delta);
    }
    if (this.right!.isDown) {
      this.moveShip(delta);
    }

    if (this.fire!.isDown) {
      this.fired = true;
    }
  }

  private resetShip() {
    this.playerShip!.y = this.playerStartY;
  }

  private moveShip(delta: number) {
    const newPos = this.playerShip!.x + delta * this.moveSpeed;
    const rightEdge = this.game.canvas.width - this.edgePadding;
    if (newPos < this.edgePadding) {
      this.playerShip!.x = this.edgePadding;
    } else if (newPos > rightEdge) {
      this.playerShip!.x = rightEdge;
    } else {
      this.playerShip!.x = newPos;
    }
  }
}
