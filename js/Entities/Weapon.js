class Weapon extends Entity {

    constructor(game, weaponSheet, hero, width, height) {
        super(game, hero.hitbox.xMin, hero.hitbox.yMin, width, height, 2);
        this.context = this.game.GAME_CONTEXT;
        this.scale = 2.4;
        this.animation = new Animation(weaponSheet, this, 35, 35, .050, this.scale);
        this.hero = hero;
        this.status = 'weapon';
        this.WHIP_MAX_DIMENSION = 35;
        this.WHIP_MIN_DIMENSION = 7;
        this.WHIP_SPRITE_OFFSET = 2;
        this.alive = true;
        this.active = false;

    }

    preUpdate() {
        switch (this.direction) {
            case 0:
                this.animation.frameWidth = this.WHIP_MIN_DIMENSION;
                this.animation.frameHeight = this.WHIP_MAX_DIMENSION;
                this.futureHitbox.xMin = this.hero.hitbox.xMin + this.hero.width * this.HITBOX_SHRINK_FACTOR;
                this.futureHitbox.yMin = this.hero.hitbox.yMin - this.hero.height;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.WHIP_MIN_DIMENSION * this.scale;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.WHIP_MAX_DIMENSION * this.scale;
                break;
            case 1:
                this.animation.frameWidth = this.WHIP_MIN_DIMENSION;
                this.animation.frameHeight = this.WHIP_MAX_DIMENSION;
                this.futureHitbox.xMin = this.hero.hitbox.xMin;
                this.futureHitbox.yMin = this.hero.hitbox.yMin + this.hero.height * this.HITBOX_SHRINK_FACTOR;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.WHIP_MIN_DIMENSION * this.scale;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.WHIP_MAX_DIMENSION * this.scale;
                break;
            case 2:
                this.animation.frameWidth = this.WHIP_MAX_DIMENSION;
                this.animation.frameHeight = this.WHIP_MIN_DIMENSION;
                this.futureHitbox.xMin = this.hero.hitbox.xMin - this.width * this.HITBOX_SHRINK_FACTOR;
                this.futureHitbox.yMin = this.hero.hitbox.yMin +
                    (this.hero.height / this.WHIP_SPRITE_OFFSET / this.HITBOX_SHRINK_FACTOR);
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.WHIP_MAX_DIMENSION * this.scale;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.WHIP_MIN_DIMENSION * this.scale;
                break;
            case 3:
                this.animation.frameWidth = this.WHIP_MAX_DIMENSION;
                this.animation.frameHeight = this.WHIP_MIN_DIMENSION;
                this.futureHitbox.xMin = this.hero.hitbox.xMin + this.hero.width / this.HITBOX_SHRINK_FACTOR;
                this.futureHitbox.yMin = this.hero.hitbox.yMin +
                    (this.hero.height / this.WHIP_SPRITE_OFFSET / this.HITBOX_SHRINK_FACTOR);
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.WHIP_MAX_DIMENSION * this.scale;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.WHIP_MIN_DIMENSION * this.scale;
                break;
        }
    }


    update() {
        this.pushUpdate = true;
        super.update();
    }

    draw() {
        if (this.active && this.hero.alive) {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status, this.direction);
        }
    }
}