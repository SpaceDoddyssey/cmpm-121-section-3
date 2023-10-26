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

  enemies: Enemy[] = [];
  enemySpeed = 0.25;

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

    this.addBackground();

    this.addPlayerShip();

    this.spawnEnemy("basic");
    setTimeout(() => {
      this.spawnEnemy("small");
    }, 2000);
  }

  addPlayerShip() {
    this.playerShip = this.add.rectangle(
      100,
      this.playerStartY,
      50,
      50,
      0x6c3bbf,
    );
  }

  addBackground() {
    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);
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

    this.enemies.forEach((enemy) => {
      enemy.move(delta);
    });
  }

  private spawnEnemy(type: string) {
    this.enemies.push(new Enemy(type, this));
    let timeout;
    if (type == "basic") {
      timeout = Math.random() * 2000 + 500;
    } else {
      timeout = 5000;
    }
    setTimeout(() => {
      this.spawnEnemy(type);
    }, timeout);
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
    this.fired = false;
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

class Enemy {
  sprite: Phaser.GameObjects.Rectangle;
  moveSpeed: number;

  constructor(type: string, scene: Phaser.Scene) {
    let color;
    let startingY;
    if (type == "basic") {
      this.moveSpeed = 0.3;
      startingY = Math.random() * 400;
      color = 0xff0000;
    } else {
      this.moveSpeed = 0.6;
      startingY = 50;
      color = 0xffffff;
    }

    this.sprite = scene.add.rectangle(900, startingY, 50, 50, color);
  }

  public move(delta: number) {
    this.sprite.x -= delta * this.moveSpeed;
  }
}
