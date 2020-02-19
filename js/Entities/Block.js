class Block extends Entity {
    draw() {
        // do nothing
    }
}

class InvisibleBlock extends Block {
}

class Pit extends Block {
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
        console.log(this.abyssHitbox);

    };
}