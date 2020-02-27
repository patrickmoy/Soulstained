class Enemy extends Entity {
    constructor(game, x, y, width, height, health) {
        super(game, x, y, width, height, 1);
        this.context = game.GAME_CONTEXT;
        this.ORIGINAL_X = x; // Variable to keep track of where the entity started at in the x position
        this.ORIGINAL_Y = y; // Variable to keep track of where the entity started at in the y position
        this.ORIGINAL_HEALTH = health;
        this.health = health;
        this.alive = true;
        this.ALLOWED_TRACKING_ERROR = 30;
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
        //this.alive = true;
        this.health = this.ORIGINAL_HEALTH;
        this.alive = true;
        console.log(this.pushDamage);
    }

    randomWalk(maxTime, cooldown) {
        if (cooldown === 0 && this.directionTime < maxTime) {
            this.walk(this.direction);
            if (this.notOnScreen()) { // Resets the crab position since he's trying to go out of border.
                this.futureHitbox.xMin = this.hitbox.xMin;
                this.futureHitbox.yMin = this.hitbox.yMin;
                this.futureHitbox.xMax = this.hitbox.xMax;
                this.futureHitbox.yMax = this.hitbox.yMax;
                this.direction = Math.floor(Math.random() * 4.5); // Changes the direction
            }
            this.directionTime++;
        } else {
            this.direction = Math.floor(Math.random() * 4.5); // Gets a random direction.
            this.directionTime = 0;
        }
    }

    /**
     * Checks the line of sight of the entity with the hero.
     * @param detectRange {number} the range in pixels for the enemy to detect the player
     * @return {boolean} true if the enemy can see the hero within the detect range distance; false otherwise
     */
    LOSSearch(detectRange) {
        const heroPosX = (this.game.HERO.hitbox.xMin + this.game.HERO.hitbox.xMax) / 2; // Gets the hero's center x
        const heroPosY = (this.game.HERO.hitbox.yMin + this.game.HERO.hitbox.yMax) / 2; // Gets the hero's center y
        const enemyPosX = (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2; // Gets the enemy's center x
        const enemyPosY = (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2; // Gets the enemy's center y
        // Detects if the player is within the detection range of the enemy
        const isInRadius = heroPosX > enemyPosX - detectRange && heroPosX < enemyPosX + detectRange &&
            heroPosY > enemyPosY - detectRange && heroPosY < enemyPosY + detectRange;

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

                let speedAdjust = (Math.abs(diffX) >= this.ALLOWED_TRACKING_ERROR &&
                    Math.abs(diffY) >= this.ALLOWED_TRACKING_ERROR) ? this.game.DIAGONAL_ADJUSTMENT : 1.0;

                if (diffX < 0) {
                    this.futureHitbox.xMin -= this.game.clockTick * this.speed * speedAdjust;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                }
                // Zombie is to the left of hero so move right
                if (diffX > 0) {
                    this.futureHitbox.xMin += this.game.clockTick * this.speed * speedAdjust;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                }
                // Zombie is below the hero so move up
                if (diffY < 0) {
                    this.futureHitbox.yMin -= this.game.clockTick * this.speed * speedAdjust;
                    this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                }
                // Zombie is above the hero so move down
                if (diffY > 0) {
                    this.futureHitbox.yMin += this.game.clockTick * this.speed * speedAdjust;
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

    followHero() {
        const heroPosX = (this.game.HERO.hitbox.xMin + this.game.HERO.hitbox.xMax) / 2; // Gets the hero's center x
        const heroPosY = (this.game.HERO.hitbox.yMin + this.game.HERO.hitbox.yMax) / 2; // Gets the hero's center y


        // Difference between hero and enemy in x direction
        var diffX = heroPosX - (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2;
        //Difference between hero and enemy in y direction
        var diffY = heroPosY - (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2;
        let speedAdjust = (Math.abs(diffX) >= this.ALLOWED_TRACKING_ERROR &&
            Math.abs(diffY) >= this.ALLOWED_TRACKING_ERROR) ? this.game.DIAGONAL_ADJUSTMENT : 1.0;
        if (diffX < 0) {
            this.futureHitbox.xMin -= this.game.clockTick * this.speed * speedAdjust;
            this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
        }
        if (diffX > 0) {
            this.futureHitbox.xMin += this.game.clockTick * this.speed * speedAdjust;
            this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
        }
        if (diffY < 0) {
            this.futureHitbox.yMin -= this.game.clockTick * this.speed * speedAdjust;
            this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
        }
        if (diffY > 0) {
            this.futureHitbox.yMin += this.game.clockTick * this.speed * speedAdjust;
            this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
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
        super(game, x, y, width, height, 1);
        this.spritesheet = new Animation(spritesheet, this, 16, 16, .25, 2.3);
        this.speed = 85;
        this.directionTime = 0;
        this.alive = true;
        this.direction = Math.floor(Math.random() * 4.5);
    }

    preUpdate() {
        this.randomWalk(25, 0);
    }

    draw() {
        this.spritesheet.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking');
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
        this.status = 'walking';
        this.pushUpdate = false;
        this.directionTime = 0;
        this.direction = Math.floor(Math.random() * 4.5);
        this.detectRange = 200; // The range for the zombie to detect the hero
    }

    preUpdate() {
        // Detects if Hero is near the zombie.
        if (this.LOSSearch(200)) {
            // Actually perform the zombie movement.
            this.followHero();
            this.movementCooldown = 5;
        } else {
            this.randomWalk(50, this.movementCooldown);
            if (this.movementCooldown > 0) this.movementCooldown--;
        }
    }

    /**
     * Checks if the zombie can move to the new position without conflict with the blocks
     * @returns {boolean} true if zombie can move without colliding with blocks; false otherwise
     */
    canWalkHere() {
        var blocksWithEnemy = this.game.currentEntities[1]; // Get the blocks
        //Refactor given that detectCollide function takes two lists as arguments.
        //blocksWithEnemy.push(this); // Add the zombie to the blocks
        var collide = detectCollide(blocksWithEnemy, [this]); // Check if there's any collision
        // locksWithEnemy.pop(); // Remove zombie from blocks
        return collide.length === 0; // Return if there was collision or not.
    }

    draw() {
        this.context.beginPath();
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.stroke();
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status);
    }
}

class Necromancer
    extends Enemy {

    constructor(game, spritesheet, x, y, width, height, array) {
        super(game, x, y, width, height, 2);
        this.tempCoordX = this.futureHitbox.xMin; // Stores the x-coord beneath the necormancer.
        this.tempCoordY = this.futureHitbox.yMin; // Stores the y-coord beneath the necromancer.
        this.alive = true;
        this.animation = new Animation(spritesheet, this, 191, 157, .1, 1, [13], 1); // Necromancer sprite
        this.context = game.GAME_CONTEXT;
        this.enemiesArray = array; // Passing in ENEMIES array.
        this.location = { //Necromancer teleport locations.
            0: [50, 50],
            1: [500, 50],
            2: [50, 100],
            3: [500, 100]
        };
        this.knightCount = 1; // Counter to generate how many knights per respawn.
        this.knightSpawned = 0; // Counter number of spawned knights on screen, used to reset conditional.
        this.count = 0; // Stores the elapsed game clock time
        this.attackCount = 0; // Use to count the completion of attack cycles.
        this.totalSpawned = 0; // Counter for total number of spawned knights.
        this.teleportAnimation = false;
        this.teleportMove = false;

    }

    preUpdate() {
        this.spawnKnight();
        this.count += this.game.clockTick;
        this.actionElapsedTime += this.game.clockTick;

        if (this.knightSpawned === 0) {
            this.spawnKnight();
            if (this.knightSpawned === -1) {
                this.futureHitbox.xMin = 300;
                this.futureHitbox.yMin = 100;
                this.teleportMove = false;
            }
        }
        if (this.teleportMove === true) {

            this.teleportAnimation = false;
            this.teleportMove = false;
            let spot = Math.floor(Math.random() * 4);
            this.futureHitbox.xMin = this.location[spot][0]; // teleports necromancer to this x coordinate.
            this.futureHitbox.yMin = this.location[spot][1]; // teleports necromancer to this y coordinate.
            this.tempCoordX = this.location[spot][0]; // Returns the x - coordinate to be used to determine where to spawn new projectile after teleport.
            this.tempCoordY = this.location[spot][1]; // Returns the y - coordinate to be used to determine where to spawn new projectile after teleport.
            this.attackAndSet();

        } else if (this.count >= 3.9) { // HARD CODED VALUE FOR NOW... NOT FINAL
            this.count = 0;

            if (this.attackCount < 5) {
                this.fireBallAttack();
                this.attackCount++;
            } else if (this.attackCount === 4) {

                this.teleportAnimation = true;
                this.checkKnightCount();
                this.attackCount = 0;
            }
        }
    }

    draw() {

        if (this.teleportAnimation === true && this.actionElapsedTime <= 1.3) {
            this.actionElapsedTime += this.game.clockTick;
            if (this.actionElapsedTime >= 1.3) {
                this.teleportMove = true;
                this.actionElapsedTime = 0;
            } else {
                this.animation.drawFrame(this.game.clockTick, this.context,
                    this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                    this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 1);
            }
        } else if (this.knightSpawned !== -1) {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 2);
        } else if (this.knightSpawned === -1 && this.isReadyToDie()) {

            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }

        // else { //draw necromancer on knees}
    }

    isReadyToDie() {
        return this.futureHitbox.xMin === 300 && this.futureHitbox.yMin === 100;
    }

//Constructs fireball entity. (right now all attacks are randomly generated)
    fireBallAttack() {

        if (this.game.currentEntities[3].every(projectile => projectile.projectileNotOnScreen() || this.game.currentEntities[3].every(projectile => projectile.alive === false))) {
            // if (this.game.currentEntities[3].length <= 3 || this.game.currentEntities[3].filter(anyFireball => anyFireball.alive === false || this.game.currentEntities[3].length <= 3)) {
            let primary = Math.floor(Math.random() * 4);
            let secondary = Math.floor(Math.random() * 2);
            this.fireball1 = new FireballProjectile(this.game, this.game.ASSETS_LIST["./res/img/fireball.png"], this.futureHitbox.xMin, this.futureHitbox.yMin + this.height, 'down', primary, secondary);
            this.fireball2 = new FireballProjectile(this.game, this.game.ASSETS_LIST["./res/img/fireball.png"], this.futureHitbox.xMin, this.futureHitbox.yMin + this.height, 'left', primary, secondary);
            this.fireball3 = new FireballProjectile(this.game, this.game.ASSETS_LIST["./res/img/fireball.png"], this.futureHitbox.xMin, this.futureHitbox.yMin + this.height, 'right', primary, secondary);

            this.game.currentEntities[3].push(this.fireball1);
            this.game.currentEntities[3].push(this.fireball2);
            this.game.currentEntities[3].push(this.fireball3);
        }
    }

//Spawns knight in iterative order: 1, 2, 3.... until a certain value (Undecided).  Knights are randomly spawned x-coord: 0 - 600, y-coord: 300 - 600.
    spawnKnight() {

        if (this.knightCount < 6) {

            for (let i = 0; i < this.knightCount; i++) {
                let rand = Math.floor(Math.random() * 600);
                let min = 500;
                let max = 600;
                let rand2 = Math.random() * (+max - +min) + +min;
                let knight = new Knight(this.game, this.game.ASSETS_LIST["./res/img/knight.png"], rand, rand2, 60, 60);
                this.enemiesArray.push(knight);
                this.knightSpawned++;
                this.totalSpawned++;
            }
        } else {
            this.knightSpawned = -1;
        }
    }

//Deploy attack and reset counters.
    attackAndSet() {
        this.fireBallAttack();
        this.attackCount = 0;
        this.count = 0;
    }

//Compares the total number of spawned knights against the number in enemies array.  If they are equal then resets the update conditional to spawn more.
    checkKnightCount() {
        let deadKnights = this.enemiesArray.filter(enemy => enemy instanceof Knight && enemy.alive === false);
        if ((deadKnights.length) === this.totalSpawned) {
            this.knightSpawned = 0;
            this.knightCount++;
        }
    }

}

class Knight
    extends Enemy {

    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height, 2);
        this.animation = new Animation(spritesheet, this, 62, 70, .11, 2, [7], 1);
        this.context = game.GAME_CONTEXT;
        this.speed = 100;
        this.count = 0;
        this.alive = true;

    }

    preUpdate() {
        // Detects if Hero is near the zombie.
        if (this.LOSSearch(200)) {
            // Actually perform the zombie movement.
            this.followHero();
            this.movementCooldown = 5;
        } else {
            this.randomWalk(50, this.movementCooldown);
            if (this.movementCooldown > 0) this.movementCooldown--;
        }
    }

    /**
     * Checks if the zombie can move to the new position without conflict with the blocks
     * @returns {boolean} true if zombie can move without colliding with blocks; false otherwise
     */
    canWalkHere() {
        var blocksWithEnemy = this.game.currentEntities[1]; // Get the blocks
        //Refactor given that detectCollide function takes two lists as arguments.
        //blocksWithEnemy.push(this); // Add the zombie to the blocks
        var collide = detectCollide(blocksWithEnemy, [this]); // Check if there's any collision
        // locksWithEnemy.pop(); // Remove zombie from blocks
        return collide.length === 0; // Return if there was collision or not.
    }

    // draw() {
    //     this.context.beginPath();
    //     this.context.rect(this.x, this.y, this.width, this.height);
    //     this.context.stroke();
    //     this.animation.drawFrame(this.game.clockTick, this.context,
    //         this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
    //         this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status);
    // }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
    }

}


class Sniper extends Enemy {

    constructor(game, spritesheet, x, y, width, height, position = "SOUTH") {
        super(game, x, y, width, height, 2);
        this.alive = true;
        this.animation = new Animation(spritesheet, this, 14, 17, .3, 5, [5], 1);
        this.context = game.GAME_CONTEXT;
        this.position = position; // Variable to hold the direction the sniper is pointing.
        this.arrow = new Arrow(this.game, this.game.ASSETS_LIST["./res/img/FIREARROW.png"], this.futureHitbox.xMin - (this.width * 2), this.futureHitbox.yMin, this.position);
        this.count = 0;
    }

    preUpdate() {

        this.count += this.game.clockTick;
        if (!this.game.pause && this.count > 3.0) {
            if (this.position === "SOUTH") {
                this.arrow = new Arrow(this.game, this.game.ASSETS_LIST["./res/img/FIREARROW.png"], this.futureHitbox.xMin - (this.width * .33), this.futureHitbox.yMin + (this.width), this.position); //correct
                this.game.currentEntities[3].push(this.arrow);

            } else if (this.position === "NORTH") {
                console.log("NORTH");
                this.arrow = new Arrow(this.game, this.game.ASSETS_LIST["./res/img/FIREARROW.png"], this.futureHitbox.xMin - (this.width * .33), this.futureHitbox.yMin - (this.height), this.position); //correct
                this.game.currentEntities[3].push(this.arrow);

            } else if (this.position === "EAST") {
                console.log("EAST");
                this.arrow = new Arrow(this.game, this.game.ASSETS_LIST["./res/img/FIREARROW.png"], this.futureHitbox.xMin + (this.width), (this.futureHitbox.yMin + this.height * .25), this.position); // correct
                this.game.currentEntities[3].push(this.arrow);


            } else if (this.position === "WEST") {
                console.log("WEST");
                this.arrow = new Arrow(this.game, this.game.ASSETS_LIST["./res/img/FIREARROW.png"], this.futureHitbox.xMin - (this.width), (this.futureHitbox.yMin - this.height * .25), this.position);
                this.game.currentEntities[3].push(this.arrow);
            }
            this.count = 0;
        }
    }


    draw() {


        if (this.position === "NORTH") {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 1);
        } else if (this.position === "EAST") {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 2);
        } else if (this.position === "WEST") {

            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 3);
        } else if (this.position === "SOUTH") {

            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }
    }

}

class Beast
    extends Enemy {

    constructor(game, spritesheet, x, y, width, height, position) {
        super(game, x, y, width, height, 2);
        this.alive = true;
        this.animation = new Animation(spritesheet, this, 67, 58, .2, 1.5, [4], 0);
        this.context = game.GAME_CONTEXT;
        this.position = position; // Variable to hold the direction the sniper is pointing.
        this.detectRange = 200;
        this.speed = 500;
        this.reverseDirection = false;
        this.entityArray = [this];
    }

    preUpdate() {

        this.selectDirection(this.position);
        this.checkWallCollision();

        if (this.reverseDirection === true) {

            if (this.position === "EAST") {

                this.position = "WEST";
                this.reverseDirection = false;

            } else if (this.position === "WEST") {

                this.position = "EAST";
                this.reverseDirection = false;
            } else if (this.position === "SOUTH") {

                this.position = "NORTH";
                this.reverseDirection = false;
            } else if (this.position === "NORTH") {

                this.position = "SOUTH";
                this.reverseDirection = false;
            }

        }
    }

    draw() {
        if (this.position === 'SOUTH') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 7);
        }
        if (this.position === 'NORTH') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 5);
        }
        if (this.position === 'EAST') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 4);
        }
        if (this.position === 'WEST') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 1);
        }
    }

    checkWallCollision() {

        let wallCollision = detectCollide(this.entityArray, this.game.currentEntities[1]);
        if (wallCollision.length >= 1) {
            this.reverseDirection = true;
        }

    }

    south() {

        this.futureHitbox.yMin += this.game.clockTick * this.speed;
        this.futureHitbox.yMax += this.game.clockTick * this.speed;
    }

    north() {

        this.futureHitbox.yMin -= this.game.clockTick * this.speed;
        this.futureHitbox.yMax -= this.game.clockTick * this.speed;
    }

    east() {

        this.futureHitbox.xMin += this.game.clockTick * this.speed;
        this.futureHitbox.xMax += this.game.clockTick * this.speed;
    }

    west() {

        this.futureHitbox.xMin -= this.game.clockTick * this.speed;
        this.futureHitbox.xMax -= this.game.clockTick * this.speed;
    }

    selectDirection(direction) {

        switch (direction) {
            case 'SOUTH':
                this.south();
                break;

            case 'NORTH':
                this.north();
                break;

            case 'EAST':
                this.east();
                break;
            case 'WEST':
                this.west();
                break;
        }

    }
}

class Mage extends Enemy {

    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height, 2);
        this.alive = true;
        this.animation = new Animation(spritesheet, this, 18, 25, .25, 4, [12], 0);
        this.context = game.GAME_CONTEXT;
        // this.detectRange = 200;
        this.count = 0;
        this.startPull = false;
    }

    preUpdate() {

        this.count += this.game.clockTick;

        if (this.count >= 3) {
            this.startPull = true;
            this.pullAttack();
            if (this.count >= 6) {
                this.count = 0;
                this.startPull = false;
            }
        }
    }

    draw() {

        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
    }

    pullAttack() {

        if (this.startPull === true) {
            this.game.HERO.gravitate(this.futureHitbox.xMin, this.futureHitbox.yMin, 125);
        }
    }

}