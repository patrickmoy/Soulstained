var coinPickup = new Howl({src: ['./res/sound/coinPickup.mp3']});

class InvisibleBlock extends Entity {
}

class Block extends InvisibleBlock {
    constructor(game, spritesheet, x, y, width, height, frameWidth, frameHeight, speed, scale, indices) {
        super(game, x, y, width, height);
        this.context = game.GAME_CONTEXT;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;

        this.animation = new Animation(this.spritesheet, this, frameWidth, frameHeight, speed, scale, indices);
    }

    draw() {
        if (!this.game.pause) this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, 'walking', 0);
    }
}


class Lock extends InvisibleBlock {

    constructor(game, spritesheet, x, y, width, height) {
        super(game, spritesheet, x, y, width, height);
        this.animation = new Animation(spritesheet, this, 16, 16, .1, 2, [0]);
        this.alive = true;
        this.opened = false;
    }


    preUpdate() {

        this.checkValidSmallKey();

    }

    draw() {

        if (!this.game.pause && this.opened === false) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, "walking", 0);

        }
    }

    checkValidSmallKey() {

        if (this.game.HERO.checkSmallKeyInventory().length > 0) {

            this.opened = true;
            delete this.game.HERO.key[this.game.HERO.smallKeyCounter];
            this.game.HERO.smallKeyCounter--;
        }
    }
}

class Bosslock extends Lock {

    constructor(game, spritesheet, x, y, width, height) {
        super(game, spritesheet, x, y, width, height);
        this.animation = new Animation(spritesheet, this, 17, 16, .1, 2, [0]);
        this.alive = true;
        this.opened = false;
    }

    preUpdate() {

        this.checkValidBossKey();

    }

    draw() {

        if (!this.game.pause && this.opened === false) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, "walking", 0);
        }
    }

    checkValidBossKey() {

        if (this.game.HERO.checkBossKeyInventory().length > 0) {

            this.opened = true;
            delete this.game.HERO.key[this.game.HERO.bossKeyCounter];
            this.game.HERO.bossKeyCounter--;
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

    update() {
        if (this.pushDamage) this.health -= 1;
        if (this.health <= 0) this.alive = false;
        if (!this.lootDropped && this.item && !this.alive) this.game.currentEntities[5].push(this.item);
    }

    randomizeItems() {
        var choice = Math.random() < 0.3 ? (Math.random() < 0.1 ? 'health' : 'coin') : undefined;
        if (choice === 'coin') this.item = new Pickup(this.game, this.x + (this.width / 2), this.y + (this.height / 2), Math.floor(Math.random() * 15), 'coin');
        if (choice === 'health') this.item = new Pickup(this.game, this.x + (this.width / 2), this.y + (this.height / 2), Math.floor(Math.random() * 2), 'health');
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
        this.plungeRate = 75;
        this.ABYSS_FACTOR = .5;
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
        if (type === 'smallKey') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/smallkey.png'], this, 7, 14, .15, 2, [0]);
        if (type === 'bossKey') this.animation = new Animation(this.game.ASSETS_LIST['./res/img/bosskey.png'], this, 9, 14, .15, 2, [0]);

    }

    add(hero) {
        if (this.alive) {
            if (this.type === 'health') {
                hero.health += this.amount;
            }
            if (this.type === 'coin') {
                coinPickup.play();
                hero.coins += this.amount;
            }
            if (this.type === 'smallKey') {

                hero.acquireSmallKey();
            }
            if (this.type === 'bossKey') {

                hero.acquireBossKey();
            }
            this.alive = false;
        }
    }

    draw() {
        if (this.alive) this.animation.drawFrame(this.game.clockTick, this.game.GAME_CONTEXT, this.x, this.y, 'walking', 0);
    }
}