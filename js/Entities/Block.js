var coinPickup = new Howl({src: ['./res/sound/coinPickup.mp3']});
var heartPickup = new Howl({src: ['./res/sound/heartPickup.mp3'], volume: 0.5});

class InvisibleBlock extends Entity {

}

class Block extends InvisibleBlock {
    constructor(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices) {
        super(game, x, y, width, height);
        this.context = game.GAME_CONTEXT;
        this.spritesheet = spritesheet;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.animation = new Animation(this.spritesheet, this, frameWidth, frameHeight, speed, scale, indices);
    }

    draw() {
        this.animation.drawFrame(this.game.clockTick, this.context, this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR), this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
    }
}


class Lock extends InvisibleBlock {

    constructor(game, lockSprite, bossLockSprite, x, y, width, height, face, strength) {
        super(game, x, y, width, height);
        this.strength = strength;
        this.face = face;
        this.context = game.GAME_CONTEXT;
        this.spritesheet = undefined;
        if (this.strength === 'smallkey') {
            this.spritesheet = lockSprite;
        } else if (this.strength === 'boss') {
            this.spritesheet = bossLockSprite;
        }
        this.alive = true;
    }


    update() {
        if (this.pushUnlock) {
            if (this.strength === 'smallkey') {
                if (this.game.HERO.smallKeys >= 1) {
                    this.game.HERO.smallKeys--;
                    this.deleteSelf();
                }

            } else if (this.strength === 'boss') {
                if (this.game.HERO.hasBossKey) {
                    this.deleteSelf();
                }
            }
            this.pushUnlock = false;
        }
    }

    draw() {
        if (this.strength === 'smallkey') {
            let xIndex;
            switch (this.face) {
                case 'NORTH':
                    xIndex = 0;
                    break;
                case 'SOUTH':
                    xIndex = 1;
                    break;
                case 'WEST':
                    xIndex = 2;
                    break;
                case 'EAST':
                    xIndex = 3;
                    break;
                default:
                    xIndex = 1;
                    break;
            }
            this.context.drawImage(this.spritesheet, xIndex * 16, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60)
        } else if (this.strength === 'boss') {
            this.context.drawImage(this.spritesheet, 0, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60)
        }
    }

}

class Rubble extends Block {
    constructor(game, spritesheet, x, y) {
        super(game, spritesheet, x, y, 60, 60, 16, 16, 0, 2.4, [0]);
        this.alive = true;
    }

    draw() {
        this.game.GAME_CONTEXT.drawImage(this.spritesheet, this.hitbox.xMin - 6, this.hitbox.yMin - 6, 60, 60);
    }

    update() {
        if (entitiesCollided(this, this.game.HERO.hadoukenProj)) {
            console.log("DESTROYED BY HADOUKEN!");
            //TODO: Fix lazy logic, because using a this.deleteSelf call is problematic on a global scale
            // Add new way of deleting rubble
        }
    }
}

class DestructibleBlock
    extends Block {
    constructor(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices, health = 1, item) {
        super(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices);
        this.lootDropped = false;
        this.health = health;
        this.item = item;
        this.alive = true;
        if (!item) this.randomizeItems()
    }

    eventWalk() {
        if (this.hitbox.xMin < this.originalHitbox.xMin) {
            this.hitbox.xMin += this.game.GAME_CONTEXT.canvas.width / (this.game.currentWorld.SIZE / this.game.currentWorld.SOURCE_SHIFT);
        } else if (this.hitbox.xMin > this.originalHitbox.xMin) {
            this.hitbox.xMin -= this.game.GAME_CONTEXT.canvas.width / (this.game.currentWorld.SIZE / this.game.currentWorld.SOURCE_SHIFT);
        }

        if (this.hitbox.yMin < this.originalHitbox.yMin) {
            this.hitbox.yMin += this.game.GAME_CONTEXT.canvas.height / (this.game.currentWorld.SIZE / this.game.currentWorld.SOURCE_SHIFT);
        } else if (this.hitbox.yMin > this.originalHitbox.yMin) {
            this.hitbox.yMin -= this.game.GAME_CONTEXT.canvas.height / (this.game.currentWorld.SIZE / this.game.currentWorld.SOURCE_SHIFT);
        }
    }

    update() {
        if (this.pushDamage) this.health -= 1;
        if (this.health <= 0) this.alive = false;
        if (!this.lootDropped && this.item && !this.alive) this.game.currentEntities[5].push(this.item);
    }

    randomizeItems() {
        var choice = Math.random() < 0.3 ? (Math.random() < 0.5 ? 'health' : 'coin') : undefined;
        if (choice === 'coin') this.item = new Pickup(this.game, this.x + (this.width / 2), this.y + (this.height / 2), Math.ceil(Math.random() * 15), 'coin');
        if (choice === 'health') this.item = new Pickup(this.game, this.x + (this.width / 2), this.y + (this.height / 2), Math.ceil(Math.random() * 2), 'health');
    }

    draw() {
        if (this.alive) super.draw();
    }
}

class Pit extends InvisibleBlock {
    constructor(game, x, y) {
        super(game, x, y, 60, 60);
        this.HITBOX_SHRINK_FACTOR = .8;
        this.slipRate = 10;
        this.plungeRate = 100; // How fast hero "falls" towards the pit center.
        this.ABYSS_FACTOR = .65; // How large the "pit" hitbox is - where you fall, and don't just slip.
                                // Select value from 0.5 to this.HITBOX_SHRINK_FACTOR in size.
        this.focusX = (this.hitbox.xMin + this.hitbox.xMax) / 2;
        this.focusY = (this.hitbox.yMin + this.hitbox.yMax) / 2;
        this.hitbox = {
            xMin: x + this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            yMin: y + this.height * (1 - this.HITBOX_SHRINK_FACTOR),
            xMax: x + this.width * this.HITBOX_SHRINK_FACTOR,
            yMax: y + this.height * this.HITBOX_SHRINK_FACTOR,
        };
        this.futureHitbox = {
            xMin: x + this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            yMin: y + this.height * (1 - this.HITBOX_SHRINK_FACTOR),
            xMax: x + this.width * this.HITBOX_SHRINK_FACTOR,
            yMax: y + this.height * this.HITBOX_SHRINK_FACTOR,
        };
        this.abyssHitbox = {
            xMin: x + this.width * (1 - this.ABYSS_FACTOR),
            xMax: x + this.width * this.ABYSS_FACTOR,
            yMin: y + this.height * (1 - this.ABYSS_FACTOR),
            yMax: y + this.height * this.ABYSS_FACTOR
        };
    };
}

class WorldAnimation {
    constructor(game, spritesheet, x, y, scale, frameCount) {
        this.game = game;
        this.context = game.GAME_CONTEXT;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.animation = new Animation(this.spritesheet, this, 16, 16, .16, scale, frameCount);
    }

    draw() {
        if (!this.game.pause) this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, 'walking', 0);
    }
}

class Pickup extends Entity {
    constructor(game, x, y, amount = 1, type = 'coin') {
        super(game, x, y, 20, 20);
        this.alive = true;
        this.amount = amount;
        this.type = type;
        this.x = x - 20;
        this.y = y - 20;
        this.animation = undefined;
        if (type === 'health') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/heartAnimation.png'], this, 16, 11, 0.15, 2, [4]);
        if (type === 'coin') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/coinAnimation.png'], this, 11, 11, 0.15, 2, [4]);
        if (type === 'smallkey') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/smallkey.png'], this, 7, 14, .15, 2, [1]);
        if (type === 'bosskey') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/bosskey.png'], this, 9, 14, .15, 2, [1]);
        if (type === 'boots') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/boots.png'], this, 18, 19, .15, 2, [1]);
        if (type === 'healthUpgrade') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/goldheart.png'], this, 16, 16, .15, 2, [1]);
        if (type === 'bow') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/bow.png'], this, 16, 16, .15, 2, [1]);
        if (type === 'bracer') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/bracer.png'], this, 30, 29, .15, 2, [1]);
    }

    add(hero) {
        if (this.alive) {
            if (this.type === 'health') {
                heartPickup.play();
                hero.health += this.amount;
                if (hero.health > hero.maxHealth) {
                    hero.health = hero.maxHealth;
                }
            }
            if (this.type === 'coin') {
                coinPickup.play();
                hero.coins += this.amount;
            }
            if (this.type === 'smallkey') {
                hero.smallKeys++;
            }
            if (this.type === 'bosskey') {
                hero.hasBossKey = true;
            }
            if (this.type === 'boots') {
                hero.inventory.push('boots');
            }
            if (this.type === 'bow') {
                hero.inventory.push('bow');
            }
            if (this.type === 'healthUpgrade') {
                hero.maxHealth = 10;
                hero.health = 10;
            }
            if (this.type === 'bracer') {
                hero.inventory.push('bracer');
            }
            this.alive = false;
        }
    }

    draw() {
        if (this.alive) this.animation.drawFrame(this.game.clockTick, this.game.GAME_CONTEXT, this.x, this.y, 'walking', 0);
    }
}

class RollingPin extends Block {
    constructor(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices, moveSpeed = 100, direction = "SOUTH") {
        super(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices);
        this.direction = direction;
        this.speed = moveSpeed;
        this.alive = true;
    }

    preUpdate() {
        super.preUpdate();
        this.pushUpdate = true;
        if (detectCollide([this], this.game.currentEntities[1]).length >= 2) {
            switch (this.direction) {
                case "SOUTH":
                    this.direction = "NORTH";
                    break;
                case "NORTH":
                    this.direction = "SOUTH";
                    break;
                case "WEST":
                    this.direction = "EAST";
                    break;
                case "EAST":
                    this.direction = "WEST";
                    break;
            }
        }
        switch (this.direction) {
            case "SOUTH":
                this.futureHitbox.yMin += this.game.clockTick * this.speed;
                this.futureHitbox.yMax += this.game.clockTick * this.speed;
                break;
            case "NORTH":
                this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                this.futureHitbox.yMax -= this.game.clockTick * this.speed;
                break;
            case "WEST":
                this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                this.futureHitbox.xMax -= this.game.clockTick * this.speed;
                break;
            case "EAST":
                this.futureHitbox.xMin += this.game.clockTick * this.speed;
                this.futureHitbox.xMax += this.game.clockTick * this.speed;
                break;
        }
    }

    update() {
        if (!this.pushUpdate) {
            const hero = this.game.HERO;
            switch (this.direction) {
                case "SOUTH":
                    // if (hero.hitbox.yMin >= this.hitbox.yMax)
                    // {
                    hero.futureHitbox.yMin += this.game.clockTick * this.speed * 1.5;
                    hero.futureHitbox.yMax += this.game.clockTick * this.speed * 1.5;
                    // }
                    break;
                case "NORTH":
                    // if (hero.hitbox.yMax <= this.hitbox.yMin)
                    // {
                    hero.futureHitbox.yMin -= this.game.clockTick * this.speed * 1.5;
                    hero.futureHitbox.yMax -= this.game.clockTick * this.speed * 1.5;
                    // }
                    break;
                case "WEST":
                    // if (hero.hitbox.xMax <= this.hitbox.xMin)
                    // {
                    hero.futureHitbox.xMin -= this.game.clockTick * this.speed * 1.5;
                    hero.futureHitbox.xMax -= this.game.clockTick * this.speed * 1.5;
                    // }
                    break;
                case "EAST":
                    // if (hero.hitbox.xMin >= this.hitbox.xMax && hero.hitbox.xMin)
                    // {
                    hero.futureHitbox.xMin += this.game.clockTick * this.speed * 1.5;
                    hero.futureHitbox.xMax += this.game.clockTick * this.speed * 1.5;
                    // }
                    break;
            }
            setBoxToThis(hero.hitbox, hero.futureHitbox);
        }
        this.pushUpdate = true;
        super.update();
    }

    draw() {
        super.draw();
    }

}