/**
 *
 */
class Hero extends Entity {
  /**
   * The entity that the player can control and play the game with.
   * @param game {GameEngine} The engine of the game for accessing
   * @param spritesheet {Image} The image of the hero for animation and updating
   */
  constructor(game, spritesheet) {
    // TODO find right width and height for hero
    super(game, 300, 420, 56, 84, 0);
    this.animation = new Animation(spritesheet, 32, 48, 8, .150, 8, true, 1.75);
    this.context = game.GAME_CONTEXT;
    this.speed = 250;
    this.direction = 1; // Where the hero is facing. North = 0, South = 1, East = 2, West = 3. Reason for number order is based off of spritesheet row
  }

  /**
   * Predicts future hitbox based on inputs.
   */
  preUpdate() {
    if (!this.game.transition) {
      if (this.game.INPUTS["KeyW"]) {
        // Moving up so direction is 0, thus the corresponding row in the sprite sheet to load for animation is 0.
        // The same applies to other directions.
        this.direction = 0;
        this.futureHitbox.yMin -= this.game.clockTick * this.speed;
        this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
      }
      if (this.game.INPUTS["KeyS"]) {
        this.direction = 1;
        this.futureHitbox.yMin += this.game.clockTick * this.speed;
        this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
      }
      if (this.game.INPUTS["KeyA"]) {
        this.direction = 2;
        this.futureHitbox.xMin -= this.game.clockTick * this.speed;
        this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
      }
      if (this.game.INPUTS["KeyD"]) {
        this.direction = 3;
        this.futureHitbox.xMin += this.game.clockTick * this.speed;
        this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
      }
    }
  }

  /**
   * Draws the hero.
   */
  draw() {
    this.animation.drawFrame(this.game.clockTick, this.context, this.hitbox.xMin, this.hitbox.yMin, this.direction);
  }

  /**
   *
   * @returns {{change: number, direction: string}}
   */
  checkBounds() {
    // Up Canvas Border
    if (this.y < 0) {
      return {
        orientation: "vertical",
        change: -1
      };
    }

    // Right Canvas Border
    if (this.x > this.game.canvasWidth) {
      return {
        orientation: "horizontal",
        change: 1
      };
    }

    // Down Canvas Border
    if (this.y > this.game.canvasHeight) {
      // I suggest changing to this.y > this.game.canvasHeight - 60
      // Or - hero.height
      // Likewise, do so for the rightmost border.
      // This would fix your issue of having to move completely off screen.
      return {
        orientation: "vertical",
        change: 1
      };
    }

    // Left Canvas Border
    if (this.x < 0) {
      return {
        orientation: "horizontal",
        change: -1
      };
    }

    // Still within border
    return {
      orientation: "",
      change: 0
    };
  }

}