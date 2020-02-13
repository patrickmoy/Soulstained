// TODO update the enemies with the new entity parameters - Steven Tran
class Enemy extends Entity {
    constructor(game, x, y, width, height, health) {
        super(game, x, y, width, height, 1);
        this.context = game.GAME_CONTEXT;
        this.ORIGINAL_X = x; // Variable to keep track of where the entity started at in the x position
        this.ORIGINAL_Y = y; // Variable to keep track of where the entity started at in the y position
        this.ORIGINAL_HEALTH = health;
        this.health = health;
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
    reset() {
        this.resetPosition();
        this.isDead = false;
        this.health = this.ORIGINAL_HEALTH;
    }

    randomWalk(maxTime, cooldown)
    {
        if (cooldown === 0 && this.directionTime < maxTime)
        {
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
        else
        {
            this.direction = Math.floor(Math.random() * 4.5); // Gets a random direction.
            this.directionTime = 0;
        }
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
        super(game, x, y, width, height, 2);
        this.spritesheet = new Animation(spritesheet, 16, 16, 2, .25, 2, true, 2.3);
        this.speed = 85;
        this.directionTime = 0;
        this.direction = Math.floor(Math.random() * 4.5);
    }

    preUpdate() {
        this.randomWalk(25, 0);
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
        super(game, x, y, width, height, 2);
        this.animation = new Animation(spritesheet, this, 16, 16, .450, 3.5);
        this.context = game.GAME_CONTEXT;
        this.speed = 100;
        this.direction = 1;
        this.pushUpdate = false;
        this.directionTime = 0;
        this.direction = Math.floor(Math.random() * 4.5);
        this.detectRange = 200; // The range for the zombie to detect the hero
    }

    preUpdate() {
        // Detects if Hero is near the zombie.
        if (this.checkLOS()) {
            // Actually perform the zombie movement.
            const heroPosX = (this.game.HERO.hitbox.xMin + this.game.HERO.hitbox.xMax) / 2; // Gets the hero's center x
            const heroPosY = (this.game.HERO.hitbox.yMin + this.game.HERO.hitbox.yMax) / 2; // Gets the hero's center y
            const zombiePosX = (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2; // Gets the zombie's center x
            const zombiePosY = (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2; // Gets the zombie's center y
            // Difference between hero and zombie in x direction
            var diffX = heroPosX - (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2;
            //Difference between hero and zombie in y direction
            var diffY = heroPosY - (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2;
            if (diffX < 0) {
                this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
            }
            if (diffX > 0) {
                this.futureHitbox.xMin += this.game.clockTick * this.speed;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
            }
            if (diffY < 0) {
                this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
            }
            if (diffY > 0) {
                this.futureHitbox.yMin += this.game.clockTick * this.speed;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
            }
            this.movementCooldown = 5;
        }
        else {
            this.randomWalk(50, this.movementCooldown);
            if (this.movementCooldown > 0) this.movementCooldown--;
        }
    }

    /**
     * Checks the line of sight of the entity with the hero.
     * @return {boolean} true if the enemy can see the hero within the detect range distance; false otherwise
     */
    checkLOS() {
        const heroPosX = (this.game.HERO.hitbox.xMin + this.game.HERO.hitbox.xMax) / 2; // Gets the hero's center x
        const heroPosY = (this.game.HERO.hitbox.yMin + this.game.HERO.hitbox.yMax) / 2; // Gets the hero's center y
        const zombiePosX = (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2; // Gets the zombie's center x
        const zombiePosY = (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2; // Gets the zombie's center y
        // Detects if the player is within the detection range of the zombie
        const isInRadius = heroPosX > zombiePosX - this.detectRange && heroPosX < zombiePosX + this.detectRange &&
            heroPosY > zombiePosY - this.detectRange && heroPosY < zombiePosY + this.detectRange;

        if (isInRadius) {

            // Original future hitbox to reset future hitbox
            const originalFutureHitbox = {
                xMin: this.futureHitbox.xMin, xMax: this.futureHitbox.xMax,
                yMin: this.futureHitbox.yMin, yMax: this.futureHitbox.yMax
            };
            var canMove = this.canWalkHere();
            while (!entitiesCollided(this.game.HERO, this) && canMove) {
                // Difference between hero and zombie in x direction
                var diffX = heroPosX - (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2;
                //Difference between hero and zombie in y direction
                var diffY = heroPosY - (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2;
                // Zombie is to the right of hero so move left
                if (diffX < 0) {
                    this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                }
                // Zombie is to the left of hero so move right
                if (diffX > 0) {
                    this.futureHitbox.xMin += this.game.clockTick * this.speed;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                }
                // Zombie is below the hero so move up
                if (diffY < 0) {
                    this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                    this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                }
                // Zombie is above the hero so move down
                if (diffY > 0) {
                    this.futureHitbox.yMin += this.game.clockTick * this.speed;
                    this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                }
                // Checks if the movement was valid with walls
                canMove = this.canWalkHere();
            }
            // Resets the zombie's hitbox
            this.futureHitbox.xMin = originalFutureHitbox.xMin;
            this.futureHitbox.xMax = originalFutureHitbox.xMax;
            this.futureHitbox.yMin = originalFutureHitbox.yMin;
            this.futureHitbox.yMax = originalFutureHitbox.yMax;
            return canMove;
        }
        return false;
    }

    /**
     * Checks if the zombie can move to the new position without conflict with the blocks
     * @returns {boolean} true if zombie can move without colliding with blocks; false otherwise
     */
    canWalkHere() {
        var blocksWithEnemy = this.game.currentEntities[1]; // Get the blocks
        blocksWithEnemy.push(this); // Add the zombie to the blocks
        var collide = detectCollide(blocksWithEnemy); // Check if there's any collision
        blocksWithEnemy.pop(); // Remove zombie from blocks
        return collide.length === 0; // Return if there was collision or not.

    }

    draw() {
        if (!this.game.pause) {
            this.context.beginPath();
            this.context.rect(this.x, this.y, this.width, this.height);
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status);
        }
    }
}


class Knight extends Enemy {

}

class Skeleton extends Enemy {

}
