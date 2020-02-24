class Chest extends Sign {

    constructor(game, spritesheet, x, y, width, height, msg, item, amount) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, this, 17, 16, .1, 2, [0]);
        this.context = game.GAME_CONTEXT;
        this.alive = true;
        this.opened = false;
        this.msg = msg;
        this.pushMessage = false;
        this.item = item;
        this.amount = amount;
        this.empty = 0;

    }

    update() {

        if (this.empty !== -1) {
            if (this.pushMessage) {
                this.opened = true;
                if (this.opened === true) {
                    this.game.msg = this.msg;
                    if (this.item === 'health') {
                        this.game.HERO.health += this.amount;
                    } else if (this.item === 'coin') {

                        this.game.HERO.coins += this.amount;
                    } else if (this.item === 'smallkey') {

                        this.game.HERO.acquireSmallKey();
                    } else if (this.item === 'bosskey') {

                        this.game.HERO.acquireBossKey();
                    }
                    this.pushMessage = false;
                }
            }
        }

    }

    draw() {
        if (!this.game.pause && this.opened === false) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, "walking", 0);
        } else if (!this.game.pause && this.opened === true) {
            this.context.beginPath();
            this.context.stroke();
            this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, "walking", 1);
            this.opened = false;
            this.empty = -1;
        }
    }




}