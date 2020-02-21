class FirePit extends Block {
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, this,16, 16, .1, 4, [4]);
        this.context = game.GAME_CONTEXT;
        this.sx = x;
        this.sy = y;
        this.status = 'walking';
    }

    draw() {
        if (!this.game.pause) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.sx, this.sy, this.status);
        }
    }
}

class Fountain extends Block
{
    constructor(game, spritesheet, x, y, frameWidth, frameHeight) {
        super(game, 0, 0, 0, 0);
        this.context = game.GAME_CONTEXT;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        // TODO why is the scale such an odd value?
        this.animation = new Animation(spritesheet, this, frameWidth, frameHeight, .125, 3.756, [3]);
    }

    draw()
    {
        if (!this.game.pause) {
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, 'walking', 0);
        }
    }
}

// TODO should not be entity but with how the code works, it has to be...
// TODO remove entity parent and store worm into its own array in game engine
class Worm extends Entity
{
    constructor(game, spritesheet, x, y)
    {
        super(game, 0, 0, 0, 0);
        this.game = game;
        this.context = game.GAME_CONTEXT;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.animation = new Animation(this.spritesheet, this, 16, 16, .16, 2.3, [3])
    }

    draw()
    {
        if (!this.game.pause) {
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, 'walking', 0);
        }
    }
}