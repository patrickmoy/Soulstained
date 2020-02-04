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
    // TODO find right width for hero
    super(game, 300, 420, 56, 84, 0);
    this.animation = new Animation(spritesheet, 32, 48, 8, .150, 8, true, 1.75);
    this.context = game.GAME_CONTEXT;
    this.speed = 250;
    this.direction = 1; // Where the hero is facing. North = 0, South = 1, East = 2, West = 3. Reason for number order is based off of spritesheet row
    this.changeDirection = 0; // Helper variable to keep track of what direction to transition
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
        this.futureHitbox.yMin -=  this.game.clockTick * this.speed;
        this.futureHitbox.yMax =  this.futureHitbox.yMin + this.height;
      }
      if (this.game.INPUTS["KeyS"]) {
        this.direction = 1;
        this.futureHitbox.yMin +=  this.game.clockTick * this.speed;
        this.futureHitbox.yMax =this.futureHitbox.yMin + this.height;
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
      this.futureHitbox.xMin = Math.floor(this.futureHitbox.xMin); // Normalize the x min coordinate for consistency
      this.futureHitbox.xMax = Math.floor(this.futureHitbox.xMax); // Normalize the x max coordinate for consistency
      this.futureHitbox.yMin = Math.floor(this.futureHitbox.yMin); // Normalize the y min coordinate for consistency
      this.futureHitbox.yMax = Math.floor(this.futureHitbox.yMax); // Normalize the y max coordinate for consistency
    }
  }

  /**
   * Moves the hero automatically based on the transition direction. This makes it look like the camera is panning while the hero is in place.
   * TODO new name?
   */
  automove()
  {
    const TRANSITION_AMOUNT_X = 10.4; // The amount of shift in the x direction when transitioning
    const TRANSITION_AMOUNT_Y = 9.9; // The amount of shift in the y direction when transitioning
    switch(this.changeDirection)
    {
      case "up":
        this.hitbox.yMin = this.hitbox.yMin + TRANSITION_AMOUNT_Y; // Add top left y coordinate with the shift amount
        this.hitbox.yMax = this.hitbox.yMin + this.height; // Updates the new y max coordinate hitbox
        this.futureHitbox.yMin = this.hitbox.yMin; // Updates the future hitbox to accommodate for the shifting
        this.futureHitbox.yMax = this.hitbox.yMax;
        break;
      case "down":
        this.hitbox.yMin = this.hitbox.yMin - TRANSITION_AMOUNT_Y; // Add top left y coordinate with the shift amount
        this.hitbox.yMax = this.hitbox.yMin + this.height; // Updates the new y max coordinate hitbox
        this.futureHitbox.yMin = this.hitbox.yMin; // Updates the future hitbox to accommodate for the shifting
        this.futureHitbox.yMax = this.hitbox.yMax;
        break;
      case "left":
        this.hitbox.xMin = this.hitbox.xMin + TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
        this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
        this.futureHitbox.xMin = this.hitbox.xMin; // Updates the future hitbox to accommodate for the shifting
        this.futureHitbox.xMax = this.hitbox.xMax;
        break;
      case "right":
        this.hitbox.xMin = this.hitbox.xMin - TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
        this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
        this.futureHitbox.xMin = this.hitbox.xMin; // Updates the future hitbox to accommodate for the shifting
        this.futureHitbox.xMax = this.hitbox.xMax;
        break;
    }
  }

  /**
   * Draws the hero.
   */
  draw() {
    this.animation.drawFrame(this.game.clockTick, this.context, this.hitbox.xMin, this.hitbox.yMin, this.direction);
  }

  /**
   * Checks to see if the hero is on the border of the Canvas. If he is, then we tell the game engine what border he is on.
   * @returns {{changeInX: number, changeInY: number}} a change in x or y that represents which tilemap. Used to add with sections in World to determine the border transition
   */
  checkBorder() {
    // Up Canvas Border
    if (this.hitbox.yMin < 0) {
      this.changeDirection = "up";
      return {
        changeInX: 0,
        changeInY: -1
      };
    }

    // Right Canvas Border
    if (this.hitbox.xMax > this.game.GAME_CANVAS_WIDTH) {
      this.changeDirection = "right";
      return {
        changeInX: 1,
        changeInY: 0
      };
    }

    // Down Canvas Border
    if (this.hitbox.yMax > this.game.GAME_CANVAS_HEIGHT) {
      this.changeDirection = "down";
      return {
        changeInX: 0,
        changeInY: 1
      };
    }

    // Left Canvas Border
    if (this.hitbox.xMin < 0) {
      this.changeDirection = "left";
      return {
        changeInX: -1,
        changeInY: 0
      };
    }

    // Still within border
    return {
      changeInX: 0,
      changeInY: 0
    };
  }

}