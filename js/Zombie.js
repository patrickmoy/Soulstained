// TODO move zombie to enemies file.
class Zombie extends Entity {

    /**
     *
     * @param game
     * @param spritesheet
     * @param x
     * @param y
     */
    constructor(game, spritesheet, x, y) {

        super(game, x, y, 56, 56);
        this.animation = new Animation(spritesheet, 16, 16, 2, .450, 2, true, 3.5);
        this.ctx = game.ctx;
        this.speed = 100;
        this.direction = 1;
        this.health = 4;
        this.count = 0;
        this.boxWidth = 56;
        this.boxHeight = 56;
        this.skipUpdate = false;
    }


    update() {
        this.skipUpdate = false;
        if (this.count > 50) {
            this.count = 0;
            this.pickDirection();
        }
        switch (this.direction) {
            case 0:
                if (this.y - (this.game.clockTick * this.speed) >= 0) {
                    this.newY -= this.game.clockTick * this.speed;
                }
                break;
            case 1:
                if (this.y + (this.game.clockTick * this.speed) <= 744) {
                    this.newY += this.game.clockTick * this.speed;
                }
                break;
            case 2:
                if (this.x - (this.game.clockTick * this.speed) >= 0) {
                    this.newX -= this.game.clockTick * this.speed;
                }
                break;
            case 3:
                if (this.x + (this.game.clockTick * this.speed) <= 744) {
                    this.newX += this.game.clockTick * this.speed;
                }
                break;
            default:
                break;
        }
        this.predictBox();
        this.count++;
    }

    draw() {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0);

    }


    pickDirection() {
        this.direction = Math.floor(Math.random() * Math.floor(5));
    }

}
