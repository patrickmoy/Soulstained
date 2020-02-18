class FirePit extends Entity {
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height, 1);
        this.animation = new Animation(spritesheet, this,16, 16, .1, 4, [4]);
        this.context = game.GAME_CONTEXT;
        this.sx = x;
        this.sy = y;
        this.status = 'walking';
        this.alive = true;
        console.log("firepit created");
    }

    update() {
        // do nothing
    }

    draw() {
        if (!this.game.pause) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.sx, this.sy, this.status);
        }
    }
}