class Entity {
    /**
     * An object in the game that has some form of interaction. An example would be walls or the hero.
     * A hero interacts with walls where he can't walk through them.
     * @param game {GameEngine} Current instance of the game
     * @param x {number} the x position of the entity relative to the canvas
     * @param y {number} the y position of the entity relative to the canvas
     * @param width {number} the width of the entity in pixels
     * @param height {number} the height of the entity in pixels
     * @param layerLevel {number} TODO unsure yet
     */
    constructor(game, x, y, width, height, layerLevel = 1) {
        this.HITBOX_SHRINK_FACTOR = .9;
        this.game = game;
        this.width = width;
        this.height = height;
        this.z = 0;

        this.originalHitbox =
        {
            xMin: x + width * (1 - this.HITBOX_SHRINK_FACTOR),
            yMin: y + height * (1 - this.HITBOX_SHRINK_FACTOR),
            xMax: x + width * this.HITBOX_SHRINK_FACTOR,
            yMax: y + height * this.HITBOX_SHRINK_FACTOR,
        };

        this.speed = 0;
        this.health = -1;
        this.jumpElapsedTime = 0;
        this.ACTION_DURATION = 0;
        this.actionElapsedTime = 0;
        this.invincibleCounter = 0;
        this.INVINCIBLE_TIME = .5;

        this.hitbox =
            {
                xMin: x + width * (1 - this.HITBOX_SHRINK_FACTOR),
                yMin: y + height * (1 - this.HITBOX_SHRINK_FACTOR),
                xMax: x + width * this.HITBOX_SHRINK_FACTOR,
                yMax: y + height * this.HITBOX_SHRINK_FACTOR,
            };
        this.futureHitbox = {
            xMin: x + width * (1 - this.HITBOX_SHRINK_FACTOR),
            yMin: y + height * (1 - this.HITBOX_SHRINK_FACTOR),
            xMax: x + width * this.HITBOX_SHRINK_FACTOR,
            yMax: y + height * this.HITBOX_SHRINK_FACTOR,
        };
        this.layerLevel = layerLevel;
        this.direction = 1;
        this.status = 'idle';
        this.alive = false;
        this.jumping = false;
        this.hurting = false;
        this.Dying = false; // State of dying, for death animations/effects.
        this.moveable = true;
        this.pushDamage = false;
        this.pushUpdate = true;
        this.movingDiagonally = false;
    }


    /**
     * Removes this entity/block from the BLOCKS array.
     */
    deleteSelf() {
        const index = this.game.currentEntities[1].indexOf(this);
        if (index > -1) {
            this.game.currentEntities[1].splice(index);
        }
    }


    /**
     * Performs a update but does not actually push it. Will go through several phases until the update is pushed.
     */
    preUpdate() {
        // Do nothing, implemented by subclasses
    }

    /**
     * Actually updates the game given that update is allowed to be pushed
     */
    update() {
       if (this.pushUpdate) {
            setBoxToThis(this.hitbox, this.futureHitbox);
        } else {
            setBoxToThis(this.futureHitbox, this.hitbox);
        }

        if (this.falling) {
            if (this.animation.scale > 0) {
                this.animation.scale -= .25;
            } else {
                this.falling = false;
                this.pushDamage = true;
                setBoxToThis(this.futureHitbox, this.originalHitbox);
                if (this instanceof Hero) {
                    setBoxToThis(this.nbx, this.originalHitbox);
                    setBoxToThis(this.nby, this.originalHitbox);
                    setBoxToThis(this.hitbox, this.originalHitbox);
                }

                this.animation.scale = 2.4;
            }
        }
        if (this.pushDamage) {
            if (!(this instanceof Hero)) {
                var hitSprite = new Animation(this.game.ASSETS_LIST["./res/img/hit.png"], this, 30, 30, 0.05, 2, [2]);
                var hitObject = {dx: this.hitbox.xMin, dy: this.hitbox.yMin, counter: 10, spritesheet: hitSprite};
                this.game.HitQueue.push(hitObject);
            }
            if (this.invincibleCounter === 0) {
                this.takeDamage();
                this.hurting = true;
            }
            this.invincibleCounter += this.game.clockTick;
            if (this.invincibleCounter > this.INVINCIBLE_TIME) {
                this.invincibleCounter = 0;
            }
            this.pushDamage = false;
        } else {
            if (this.invincibleCounter > 0) {
                this.invincibleCounter += this.game.clockTick;
            }
            if (this.invincibleCounter > this.INVINCIBLE_TIME) {
                this.invincibleCounter = 0;
            }
        }
        if (this.health === 0) {
            this.alive = false;
            var deathSprite = new Animation(this.game.ASSETS_LIST["./res/img/death.png"], this, 30, 30, 0.25, 2, [4]);
            var deathObject = {
                dx: this.hitbox.xMin,
                dy: this.hitbox.yMin,
                counter: 40,
                entity: this,
                spritesheet: deathSprite
            };
            this.game.DeathQueue.push(deathObject);
        }
    }

    // Sets status of entity to walking for this update/render tick, and updates hitbox.
    walk(direction) {
        if (!this.falling) {
            switch (direction) {
                case 0: // up
                    this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                    this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                    break;
                case 1: // down
                    this.futureHitbox.yMin += this.game.clockTick * this.speed;
                    this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                    break;
                case 2: // left
                    this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                    break;
                case 3: // right
                    this.futureHitbox.xMin += this.game.clockTick * this.speed;
                    this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                    break;
            }
        }
    }

    attack() {
        this.actionElapsedTime += this.game.clockTick;
        if (this.actionElapsedTime > this.ACTION_DURATION && this.status === 'attacking') {
            this.actionElapsedTime = 0;
            this.status = 'idle';
        } else if (this.actionElapsedTime > (this.ACTION_DURATION * 2) && this.status === 'shooting') {
            this.actionElapsedTime = 0;
            this.status = 'idle'
        }
    }

    /**
     * Draws the entity
     */
    draw() {
        // Do nothing, implemented by subclasses
    }

    /**
     *  Directs entity to take damage. Takes 1 damage if no damage is specified.
     */
    takeDamage(damage = 1) {
        if (this.health - damage < 0) {
            this.health = 0;
        } else {
            this.health -= damage;
        }
    }


    gravitate(focusX, focusY, suckRate) {
        let diffX = focusX - (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2;
        let diffY = focusY - (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2;
        // var diffX = focusX - this.futureHitbox.xMin;
        // var diffY = focusY - this.futureHitbox.yMin;


        // To the right of target, so move left.
        if (diffX < 0) {
            this.nbx.xMin -= this.game.clockTick * suckRate;
            this.nbx.xMax = this.nbx.xMin + this.width;
        }

        // To the left of target, so move right.
        if (diffX > 0) {
            this.nbx.xMin += this.game.clockTick * suckRate;
            this.nbx.xMax = this.nbx.xMin + this.width;
        }

        // Beneath target, so move up.
        if (diffY < 0) {
            this.nby.yMin -= this.game.clockTick * suckRate;
            this.nby.yMax = this.nby.yMin + this.height;
        }

        // Above target, so move down.
        if (diffY > 0) {
            this.nby.yMin += this.game.clockTick * suckRate;
            this.nby.yMax = this.nby.yMin + this.height;
        }
    }


}

class Sign extends Entity {
    constructor(game, x, y, width, height, message) {
        super(game, x, y, width, height);
        this.msg = message;
        this.pushMessage = false;
        this.alive = true;
    }

    //override Entity update
    update() {
        if (this.pushMessage) {
            if (this.game.newMsg === false) {
                this.game.newMsg = true;
                this.game.msg = this.msg;
                this.pushMessage = false;
            }
        }
    }
}

class NPC extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height);
    }
}

class Merchant extends NPC {
    constructor(game, spritesheet, x, y, width, height, items = []) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, this, 30, 45, 1, 1.4, [2], 0);
        this.items = items;
        this.pushTransaction = false;
        this.alive = true;
    }

    update() {
        if (this.pushTransaction) {
            if (!this.game.newTransaction)
            {
                this.game.newTransaction = !this.game.newTransaction;
                this.game.goods = this.items;
                this.pushTransaction = false;
            }
        }
    }

    draw() {
        this.animation.drawFrame(this.game.clockTick, this.game.GAME_CONTEXT, this.hitbox.xMin, this.hitbox.yMin, "walking");
    }
}

class TargetPuzzle extends Enemy {

    constructor(game, x, y, latch, time, motion, speed) {
        super(game, x, y, 60, 60, 1);
        this.spritesheet = null;
        this.latch = latch; // Enclosing trigger latch that creates target puzzles.
        this.time = time; // Time puzzle lingers.
        this.timeCount = 0;
        // Integer of number of squares that the target can oscillate in a given direction (0, 1, 2, etc.).
        this.motionX = motion.x;
        this.motionY = motion.y;
        this.speed = speed;
        this.motionCounter = 0;
        this.motionDirection = "positive";
        this.originalHitbox =
            {
                xMin: this.x + 6,
                xMax: this.x + 54,
                yMin: this.y + 6,
                yMax: this.y + 54
            };
        this.maximumHitbox =
            {
                xMin: this.x + 6 + this.motionX * 60,
                xMax: this.x + 54 + this.motionX * 60,
                yMin: this.y + 6 + this.motionY * 60,
                yMax: this.y + 54 + this.motionY * 60
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
            this.latch.targetCount--;
        }
        if (!this.alive) {
            this.latch.targetCount++;
        }
    }

    draw() {
        this.game.GAME_CONTEXT.drawImage(this.spritesheet, this.x, this.y, 60, 60);
    }
}

class Latch extends Sign {
    constructor(game, x, y, trigger, targetArray, time, threshold) {
        super(game, x, y, 60, 60, "SHOOT ALL THE TARGETS QUICKLY");
        this.trigger = trigger;
        this.targetArray = targetArray;
        this.activated = false;
        this.targetCount = 0;
        this.threshold = threshold;
        this.timeCounter = 0;
    }

    update () {
        if (this.activated) {
            this.timeCounter += this.game.clockTick;
            if (this.timeCounter >= this.threshold) {
                this.activated = false;
                this.timeCounter = 0;
            }
        } else if (this.pushMessage && !this.activated) {
            if (this.game.newMsg === false) {
                this.game.newMsg = true;
                this.game.msg = this.msg;
                this.pushMessage = false;
                this.activated = true;
                for (let i = 0; i < targetArray.length; i++) {
                    const target = new TargetPuzzle(this.game, targetArray[i].x, targetArray[i].y, this, this.time,
                        targetArray[i].motion, targetArray[i].speed);
                    this.game.currentEntities[2].push(target);
                }
            }
        }
        if (this.targetCount >= this.threshold) {
            this.game.gateTriggers[this.trigger] = true;
        }
    }
}