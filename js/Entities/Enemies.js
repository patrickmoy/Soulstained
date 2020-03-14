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
        this.lootDropped = false;
    }

    update() {
        super.update();
        if (!this.alive && !this.lootDropped) {
            var choice = Math.random() < 0.5 ? (Math.random() < 0.1 ? 'health' : 'coin') : undefined;
            var item = undefined;
            if (choice === 'coin') item = new Pickup(this.game, this.hitbox.xMin + (this.width / 2), this.hitbox.yMin + (this.height / 2), Math.floor(Math.random() * 15), 'coin');
            if (choice === 'health') item = new Pickup(this.game, this.hitbox.xMin + (this.width / 2), this.hitbox.yMin + (this.height / 2), Math.floor(Math.random() * 2), 'health');
            if (item !== undefined) this.game.currentEntities[5].push(item);
            this.lootDropped = true;
        }
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
        this.height = height;
        this.width = width;
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

    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height, 2);
        this.tempCoordX = this.futureHitbox.xMin; // Stores the x-coord beneath the necormancer.
        this.tempCoordY = this.futureHitbox.yMin; // Stores the y-coord beneath the necromancer.
        this.alive = true;
        this.animation = new Animation(spritesheet, this, 192, 192, .1, 1, [13], 1); // Necromancer sprite
        this.context = game.GAME_CONTEXT;
        this.health = 1;
        this.location = { //Necromancer teleport locations.
            0: [250, 25],
            1: [400, 75],
            2: [150, 75],
            3: [400, 25]
        };
        this.knightCount = 0; // Counter to generate how many knights per respawn.
        this.knightSpawned = 0; // Counter number of spawned knights on screen, used to reset conditional.
        this.count = 0; // Stores the elapsed game clock time
        this.attackCount = 0; // Use to count the completion of attack cycles.
        this.totalSpawned = 0; // Counter for total number of spawned knights.
        this.teleportAnimation = false;
        this.teleportMove = false;
        this.dead = false;

    }

    update() {
        this.pushUpdate = true;
        super.update();
        this.lootDropped = false;
        if (this.dead && !this.lootDropped) {
            const bracer = new Pickup(this.game, this.hitbox.xMin + (this.width / 2), this.hitbox.yMin + (this.height / 2), 1, "bracer");
            this.lootDropped = true;
            console.log(bracer);

            this.game.currentEntities[5].push(bracer);
            console.log(this.game.currentEntities[5]);
        }
    }


    preUpdate() {


        this.count += this.game.clockTick;
        if (this.knightSpawned === 0) {
            this.spawnKnight();
            if (this.knightSpawned === -1) {
                this.futureHitbox.xMin = 300;
                this.futureHitbox.yMin = 300;
                this.teleportMove = false;
            }
        }
        if (this.teleportMove === true && !this.isReadyToDie()) {
            this.teleportMove = false;
            let spot = Math.floor(Math.random() * 4);
            this.futureHitbox.xMin = this.location[spot][0]; // teleports necromancer to this x coordinate.
            this.futureHitbox.yMin = this.location[spot][1]; // teleports necromancer to this y coordinate.
            this.tempCoordX = this.location[spot][0]; // Returns the x - coordinate to be used to determine where to spawn new projectile after teleport.
            this.tempCoordY = this.location[spot][1]; // Returns the y - coordinate to be used to determine where to spawn new projectile after teleport.
            this.attackAndSet();

        } else if (this.count >= 3.9) { // HARD CODED VALUE FOR NOW... NOT FINAL
            this.count = 0;

            if (this.attackCount === 2) {

                this.teleportAnimation = true;
                this.checkKnightCount();
                this.attackCount = 0;

            } else if ((this.attackCount < 3) && !this.isReadyToDie()) {

                this.fireBallAttack();
                this.attackCount++;
            }
        }

    }

    draw() {

        if (this.teleportAnimation === true && this.actionElapsedTime <= 1.3) {
            this.actionElapsedTime += this.game.clockTick;
            if (this.actionElapsedTime >= 1.3) {
                this.teleportMove = true;
                this.actionElapsedTime = 0;
                this.teleportAnimation = false;
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
            this.dead = true;
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
            this.alive = false;
            this.update();

        }

    }

    isReadyToDie() {
        return this.futureHitbox.xMin === 300 && this.futureHitbox.yMin === 300;
    }

//Constructs fireball entity. (right now all attacks are randomly generated)
    fireBallAttack() {

        if (this.game.currentEntities[3].every(projectile => projectile.projectileNotOnScreen() || this.game.currentEntities[3].every(projectile => projectile.alive === false))) {
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

            if (this.knightCount === 0) {
                this.knightCount = 1;
            }

            for (let i = 0; i < this.knightCount; i++) {
                let minX = 56;
                let maxX = 546;
                let rand = Math.random() * (+maxX - +minX) + +minX;
                let min = 500;
                let max = 500;
                let rand2 = Math.random() * (+max - +min) + +min;
                let knight = new Knight(this.game, this.game.ASSETS_LIST["./res/img/knight.png"], rand, rand2, 60, 60);
                this.game.currentEntities[2].push(knight);
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

        if (this.game.deadEntities.length === this.totalSpawned) {
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
        this.speed = 50;
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
        var collide = detectCollide(blocksWithEnemy, [this]); // Check if there's any collision
        return collide.length === 0; // Return if there was collision or not.
    }

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
        this.vertarrow = new VerticalArrow(this.game, this.game.ASSETS_LIST["./res/img/vert_arrow.png"], this.futureHitbox.xMin - (this.width * 2), this.futureHitbox.yMin, this.position);
        this.horizarrow = new HorizontalArrow(this.game, this.game.ASSETS_LIST["./res/img/horiz_arrow.png"], this.futureHitbox.xMin - (this.width * 2), this.futureHitbox.yMin, this.position);
        this.count = 0;
    }

    preUpdate() {

        this.count += this.game.clockTick;
        if (!this.game.pause && this.count > 3.0) {
            if (this.position === "SOUTH") {
                this.vertarrow = new VerticalArrow(this.game, this.game.ASSETS_LIST["./res/img/vert_arrow.png"], this.futureHitbox.xMin + (this.futureHitbox.xMin * .10), this.futureHitbox.yMin + this.height, this.position); //correct
                this.game.currentEntities[3].push(this.vertarrow);

            } else if (this.position === "NORTH") {
                this.vertarrow = new VerticalArrow(this.game, this.game.ASSETS_LIST["./res/img/vert_arrow.png"], this.futureHitbox.xMin + (this.futureHitbox.xMin * .025), this.futureHitbox.yMin - (this.futureHitbox.yMin * .15), this.position); //correct
                this.game.currentEntities[3].push(this.vertarrow);

            } else if (this.position === "EAST") {
                this.horizarrow = new HorizontalArrow(this.game, this.game.ASSETS_LIST["./res/img/horiz_arrow.png"], this.futureHitbox.xMin + this.width, this.futureHitbox.yMin + (this.futureHitbox.yMin * .05), this.position); // correct
                this.game.currentEntities[3].push(this.horizarrow);


            } else if (this.position === "WEST") {
                this.horizarrow = new HorizontalArrow(this.game, this.game.ASSETS_LIST["./res/img/horiz_arrow.png"], this.futureHitbox.xMin - this.width, this.futureHitbox.yMin + (this.futureHitbox.yMin * .10), this.position); // correct
                this.game.currentEntities[3].push(this.horizarrow);
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
        this.animation = new Animation(spritesheet, this, 18, 25, .5, 4, [12], 0);
        this.context = game.GAME_CONTEXT;
        this.count = 0;
        this.startPull = false;
    }

    preUpdate() {

        this.count += this.game.clockTick;

        if (this.count >= 4) {
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
            this.game.HERO.gravitate((this.futureHitbox.xMin + this.futureHitbox.xMax) / 2,
                (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2, 75);
        }
    }

}

class Target extends Enemy {

    constructor(game, x, y, targetOwner, time, motion, speed) {
        super(game, x, y, 60, 60, 1);
        this.spritesheet = this.game.ASSETS_LIST["./res/img/dummy.png"];
        this.owner = targetOwner; // Enclosing trigger latch that creates target puzzles.
        this.time = time; // Time puzzle lingers.
        this.timeCount = 0;
        // Integer of number of squares that the target can oscillate in a given direction (0, 1, 2, etc.).
        this.motionX = motion[0];
        this.motionY = motion[1];
        this.speed = speed;
        this.motionCounter = 0;
        this.motionDirection = "positive";
        this.originalHitbox =
            {
                xMin: this.hitbox.xMin,
                xMax: this.hitbox.xMax,
                yMin: this.hitbox.yMin,
                yMax: this.hitbox.yMax
            };
        this.maximumHitbox =
            {
                xMin: this.originalHitbox.xMin + this.motionX * 60,
                xMax: this.originalHitbox.xMax + this.motionX * 60,
                yMin: this.originalHitbox.yMin + this.motionY * 60,
                yMax: this.originalHitbox.yMax + this.motionY * 60
            };

    }

    preUpdate() {
        if (this.motionX !== 0) {
            if (this.motionDirection === 'positive') {
                this.walk(3);
                this.motionCounter += ((this.speed * this.game.clockTick) / 60);
                if (this.motionCounter >= this.motionX) {
                    this.motionDirection = 'negative';
                    this.motionCounter = this.motionX;
                    setBoxToThis(this.futureHitbox, this.maximumHitbox);
                }
            } else if (this.motionDirection === 'negative') {
                this.walk(2);
                this.motionCounter -= ((this.speed * this.game.clockTick) / 60);
                if (this.motionCounter <= 0) {
                    this.motionDirection = 'positive';
                    this.motionCounter = 0;
                    setBoxToThis(this.futureHitbox, this.originalHitbox);
                }
            }
        } else if (this.motionY !== 0) {
            if (this.motionDirection === 'positive') {
                this.walk(1);
                this.motionCounter += ((this.speed * this.game.clockTick) / 60);
                if (this.motionCounter >= this.motionY) {
                    this.motionDirection = 'negative';
                    this.motionCounter = this.motionY;
                    setBoxToThis(this.futureHitbox, this.maximumHitbox);
                }
            } else if (this.motionDirection === 'negative') {
                this.walk(0);
                this.motionCounter -= ((this.speed * this.game.clockTick) / 60);
                if (this.motionCounter <= 0) {
                    this.motionDirection = 'positive';
                    this.motionCounter = 0;
                    setBoxToThis(this.futureHitbox, this.originalHitbox);
                }
            }
        }
    }

    update() {
        this.timeCount += this.game.clockTick;
        super.update();
        if (this.timeCount >= this.time) {
            this.alive = false;
            this.owner.targetCount--;
        }
        if (!this.alive) {
            this.owner.targetCount++;
        }
    }

    draw() {
        this.game.GAME_CONTEXT.drawImage(this.spritesheet, this.hitbox.xMin - 6, this.hitbox.yMin - 6, 60, 60);
    }
}

class TargetOwner extends Sign {
    constructor(game, x, y, trigger, targetArray, time, threshold) {
        super(game, x, y, 60, 60, "SHOOT ALL THE TARGETS QUICKLY");
        this.trigger = trigger;
        this.targetArray = JSON.parse(targetArray);
        this.activated = false;
        this.targetCount = 0;
        this.threshold = threshold;
        this.timeCounter = 0;
        this.time = time;
        this.complete = false;
    }

    update() {
        if (this.activated) {
            this.timeCounter += this.game.clockTick;
            if (this.timeCounter >= this.time) {
                this.activated = false;
                this.pushMessage = false;
                this.timeCounter = 0;
                this.targetCount = 0;
            }
        } else if (this.pushMessage && !this.activated && !this.complete) {
            if (this.game.newMsg === false) {
                this.game.newMsg = true;
                this.game.msg = this.msg;
                this.pushMessage = false;
                this.activated = true;
                for (let i = 0; i < this.targetArray.targets.length; i++) {
                    // In the .json, TargetArray entries are x, y, motion [x,y] , speed
                    const targData = this.targetArray.targets[i];
                    const target = new Target(this.game, targData.x, targData.y, this, this.time,
                        [targData.motionX, targData.motionY], targData.speed);
                    console.log(target);
                    this.game.currentEntities[2].push(target);
                }
            }
        }
        if (this.targetCount >= this.threshold) {
            this.game.gateTriggers[this.trigger] = true;
            this.complete = true;
        }
    }
}