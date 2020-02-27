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
        if (this instanceof Hero) {
            if (this.pushUpdateX) {
                setBoxOnlyX(this.hitbox, this.nbx);
            } else {
                setBoxToThis(this.nbx, this.hitbox);
            }
            if (this.pushUpdateY) {
                setBoxOnlyY(this.hitbox, this.nby);
            } else {
                setBoxToThis(this.nby, this.hitbox);
            }
            setBoxToThis(this.futureHitbox, this.hitbox);
        } else if (this.pushUpdate) {
            setBoxToThis(this.hitbox, this.futureHitbox);
        } else {
            setBoxToThis(this.futureHitbox, this.hitbox);
        }

        if (this.pushDamage && !(this instanceof Hero)) {
            console.log(this);
            console.log(this.pushDamage);
            var hitSprite = new Animation(this.game.ASSETS_LIST["./res/img/hit.png"], this, 30, 30, 0.05, 2, [2]);
            var hitObject = {dx: this.hitbox.xMin, dy: this.hitbox.yMin, counter: 10, spritesheet: hitSprite};
            this.game.HitQueue.push(hitObject);
        }
        if (this.falling) {
            if (this.animation.scale > 0) {
                this.animation.scale -= .25;
            } else {
                this.falling = false;
                this.pushDamage = true;
                this.futureHitbox.xMin = this.originalHitbox.xMin;
                this.futureHitbox.xMax = this.originalHitbox.xMax;
                this.futureHitbox.yMin = this.originalHitbox.yMin;
                this.futureHitbox.yMax = this.originalHitbox.yMax;
                this.animation.scale = 2.4;
            }
        }
        if (this.pushDamage) {
            if (this.invincibleCounter === 0) {
                this.takeDamage();
                this.hurting = true;
            }
            this.invincibleCounter += this.game.clockTick;
            if (this.invincibleCounter > this.INVINCIBLE_TIME) {
                this.invincibleCounter = 0;
                this.pushDamage = false;
            }
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
            // Removed since it causes speed disparities left to right and top to bottom. s
            // this.futureHitbox.xMin = Math.floor(this.futureHitbox.xMin); // Normalize the x min coordinate for consistency
            // this.futureHitbox.xMax = Math.floor(this.futureHitbox.xMax); // Normalize the x max coordinate for consistency
            // this.futureHitbox.yMin = Math.floor(this.futureHitbox.yMin); // Normalize the y min coordinate for consistency
            // this.futureHitbox.yMax = Math.floor(this.futureHitbox.yMax); // Normalize the y max coordinate for consistency
        }
    }

    attack() {
        this.actionElapsedTime += this.game.clockTick;
        if (this.actionElapsedTime > this.ACTION_DURATION) {
            this.actionElapsedTime = 0;
            this.status = 'idle';
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
        var diffX = focusX - (this.futureHitbox.xMin + this.futureHitbox.xMax) / 2;
        var diffY = focusY - (this.futureHitbox.yMin + this.futureHitbox.yMax) / 2;
        // var diffX = focusX - this.futureHitbox.xMin;
        // var diffY = focusY - this.futureHitbox.yMin;


        // To the right of target, so move left.
        if (diffX < 0) {
            this.futureHitbox.xMin -= this.game.clockTick * suckRate;
            this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
        }

        // To the left of target, so move right.
        if (diffX > 0) {
            this.futureHitbox.xMin += this.game.clockTick * suckRate;
            this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
        }

        // Beneath target, so move up.
        if (diffY < 0) {
            this.futureHitbox.yMin -= this.game.clockTick * suckRate;
            this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
        }

        // Above target, so move down.
        if (diffY > 0) {
            this.futureHitbox.yMin += this.game.clockTick * suckRate;
            this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
        }
        // this.hitbox.xMin = this.futureHitbox.xMin;
        // this.hitbox.xMax = this.futureHitbox.xMax;
        // this.hitbox.yMin = this.futureHitbox.yMin;
        // this.hitbox.yMax = this.futureHitbox.yMax;
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