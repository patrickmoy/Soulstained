class FirePit extends Entity {
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height, 1);
        this.animation = new Animation(spritesheet, 16, 16, 4, .1, 4, true, 4);
        this.context = game.GAME_CONTEXT;
        this.sx = x;
        this.sy = y;
        console.log("firepit created");
    }

    update() {
        // do nothing
    }

    draw() {
        if (!this.game.pause) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.sx, this.sy, 0, 'dancing');
        }
    }
}