// TODO update the enemies with the new entity parameters - Steven Tran
class Enemy extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height, 0);
        this.context = game.GAME_CONTEXT;
        this.ORIGINAL_X = x; // Variable to keep track of where the entity started at in the x position
        this.ORIGINAL_Y = y; // Variable to keep track of where the entity started at in the y position
    }

    /**
     * Checks if the enemy is not on the screen
     * @returns {boolean} return true if enemy is not on canvas; false otherwise.
     */
    notOnScreen() {
        return this.futureHitbox.xMax > this.game.GAME_CANVAS_WIDTH
            || this.futureHitbox.yMax > this.game.GAME_CANVAS_HEIGHT
            || this.futureHitbox.xMin < 0
            || this.futureHitbox.yMin < 0;
    }

    /**
     * Resets the position of an enemy (primarily used when transitioning)
     */
    resetPosition() {
        this.hitbox.xMin = this.originalHitbox.xMin;
        this.hitbox.xMax = this.originalHitbox.xMax;
        this.hitbox.yMin = this.originalHitbox.yMin;
        this.hitbox.yMax = this.originalHitbox.yMax;
        this.futureHitbox.xMin = this.originalHitbox.xMin;
        this.futureHitbox.xMax = this.originalHitbox.xMax;
        this.futureHitbox.yMin = this.originalHitbox.yMin;
        this.futureHitbox.yMax = this.originalHitbox.yMax;
    }

    /**
     * Resets the enemies (usually used when world transition)
     */
    reset()
    {

    }
}

class Crab extends Enemy {

    /**
     * The crab that spawns near the waters and is an enemy to the player.
     * @param game the Game Engine
     * @param spritesheet the spritesheet of the crab
     * @param x the initial x position of the crab
     * @param y the initial y position of the crab
     * @param width the width of the crab for hitbox
     * @param height the height of the crab for hitbox
     */
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height);
        this.spritesheet = new Animation(spritesheet, 16, 16, 2, .25, 2, true, 2.3);
        this.health = 2;
        this.speed = 85;
        this.directionTime = 0;
        this.direction = Math.floor(Math.random() * 4.5);
    }

    preUpdate() {
        const maxTime = 50;
        // Makes sure the direction is being updated when the crab moves in a certain direction within the max time.
        if (this.directionTime < maxTime) {
            this.walk(this.direction);
            if (this.notOnScreen()) { // Resets the crab position since he's trying to go out of border.
                this.futureHitbox.xMin = this.hitbox.xMin;
                this.futureHitbox.yMin = this.hitbox.yMin;
                this.futureHitbox.xMax = this.hitbox.xMax;
                this.futureHitbox.yMax = this.hitbox.yMax;
                this.direction = Math.floor(Math.random() * 4.5); // Changes the direction
            }
            this.directionTime++;
        }
        else {
            this.direction = Math.floor(Math.random() * 4.5); // Gets a random direction.
            this.directionTime = 0; // Resets time so new direction can move x amount of time.
        }

    }

    draw() {
        this.spritesheet.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 0, 'moving');
    }
}

class Zombie extends Enemy {
    /**
     *  A basic zombie enemy in the game. One of the more populated enemies that attacks the hero
     *  and will follow the hero.
     */
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, 16, 16, 2, .450, 2, true, 3.5);
        this.speed = 100;
        this.direction = 1;
        this.health = 4;
        this.pushUpdate = false;
    }

    preUpdate()
    {
        this.detectRange = 100;
        this.heroPosX = (this.game.HERO.hitbox.xMin + this.game.HERO.hitbox.xMax) / 2;
        this.heroPosY = (this.game.HERO.hitbox.yMin + this.game.HERO.hitbox.yMax) / 2;
        this.zombiePosX = (this.hitbox.xMin + this.hitbox.xMax) / 2;
        this.zombiePosY = (this.hitbox.yMin + this.hitbox.yMax) / 2;
        // console.log(`(${this.heroPosX}, ${this.heroPosY})`);
        // console.log(`(${this.zombiePosX - this.detectRange}, ${this.zombiePosX + this.detectRange}), (${this.zombiePosY - this.detectRange}, ${this.zombiePosY + this.detectRange})`);

        // Hero is near the zombie.
        // TODO probably better to check for not.
        if (this.heroPosX < this.zombiePosX - this.detectRange && this.heroPosX < this.zombiePosX + this.detectRange &&
            this.heroPosY > this.zombiePosY - this.detectRange && this.heroPosY < this.zombiePosY + this.detectRange)
        {

        }
        else
        {
            // console.log("Within range");
        }

    }


    draw() {
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 0, 'dancing');
        this.context.beginPath();
        this.context.rect(this.zombiePosX - this.detectRange, this.zombiePosY - this.detectRange, this.detectRange * 2, this.detectRange * 2);
        this.context.stroke();
    }
}


class Knight extends Enemy {

}

class Skeleton extends Enemy {

}
