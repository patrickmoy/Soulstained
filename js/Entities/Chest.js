class Chest extends Sign {

    constructor(game, spritesheet, x, y, width, height, msg, loot, amount = 0) {
        super(game, x, y, width, height);
        this.spritesheet = spritesheet;
        this.context = game.GAME_CONTEXT;
        this.alive = true;
        this.opened = false;
        this.msg = msg;
        this.pushMessage = false;
        this.loot = loot;
        this.amount = amount;
    }

    update() {
        if (!this.opened) {
            if (this.pushMessage) {
                if (this.game.newMsg === false) {
                    let drop;
                    if (this instanceof BigChest) {
                        drop = new Pickup(this.game, this.hitbox.xMin + 50, this.hitbox.yMin + 110, this.amount, this.loot);
                    } else {
                        drop = new Pickup(this.game, this.hitbox.xMin + 20, this.hitbox.yMin + 80, this.amount, this.loot);
                    }
                    this.game.currentEntities[5].push(drop);
                    console.log(this.game.currentEntities[5]);
                    this.opened = true;
                    this.game.newMsg = true;
                    this.game.msg = this.msg;
                    this.pushMessage = false;
                }
            }

        }
    }

    draw() {
        if (!this.game.pause && this.opened === false) {
            this.context.beginPath();
            this.context.stroke();
            this.context.drawImage(this.spritesheet, 0, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60);
        } else if (!this.game.pause && this.opened === true) {
            this.context.beginPath();
            this.context.stroke();
            this.context.drawImage(this.spritesheet, 16, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60);
        }
    }


}

class BigChest extends Chest {
    constructor(game, spritesheet, x, y, width, height, msg, loot, amount = 0) {
        super(game, spritesheet, x, y, width, height, msg, loot, amount = 0);
    }

    draw() {
        if (!this.game.pause && this.opened === false) {
            this.context.beginPath();
            this.context.stroke();
            this.context.drawImage(this.spritesheet, 0, 0, 32, 24, this.hitbox.xMin - 12, this.hitbox.yMin - 9,
                120, 90);
        } else if (!this.game.pause && this.opened === true) {
            this.context.beginPath();
            this.context.stroke();
            this.context.drawImage(this.spritesheet, 32, 0, 32, 24, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                120, 90);
        }
    }
}