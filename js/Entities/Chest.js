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

class Gate extends Sign {
    constructor(game, spritesheet, x, y, width, height, trigger) {
        super(game, x, y, width, height, "");
        this.spritesheet = spritesheet;
        this.context = game.GAME_CONTEXT;
        this.trigger = trigger;
        this.msg = 'YOU FOUND A LARGE AND IMPOSING GATE\n\nIT LOOKS LOCKED\n\nMAYBE YOU SHOULD LOOK AROUND\nTO FIND A WAY TO OPEN IT';
    }

    update() {
        if (this.game.gateTriggers[this.trigger]) {
            this.deleteSelf();
        }
        if (this.pushMessage) {
            if (this.game.newMsg === false) {
                this.game.newMsg = true;
                this.game.msg = this.msg;
                this.pushMessage = false;
            }
        }
    }

    draw() {
        this.context.drawImage(this.spritesheet, 0, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
            60, 60)
    }
}

class DungeonGate extends Gate {
    constructor(game, spritesheet, x, y, width, height, trigger, face) {
        super(game, spritesheet, x, y, width, height, trigger);
        this.face = face;
    }

    update() {
        this.pushMessage = false;
        super.update();
    }

    draw() {
        if (this.face === 'NORTH') {
            this.context.drawImage(this.spritesheet, 0, 0, 16, 16, this.hitbox.xMin - 44, this.hitbox.yMin - 6,
                60, 60);
        }
        if (this.face === 'SOUTH') {
            this.context.drawImage(this.spritesheet, 16, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60);
        }
        if (this.face === 'WEST') {
            console.log("I AM HERE");
            this.context.drawImage(this.spritesheet, 32, 0, 16, 16, this.hitbox.xMin - 36, this.hitbox.yMin - 6,
                60, 60);
        }
        if (this.face === 'EAST') {
            this.context.drawImage(this.spritesheet, 48, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60);
        }
    }
}

class Lever extends Sign {
    constructor(game, spritesheet, x, y, width, height, trigger) {
        super(game, x, y, width, height, "");
        this.spritesheet = spritesheet;
        this.context = game.GAME_CONTEXT;
        this.trigger = trigger;
        this.pulled = false;
        this.msg = 'YOU PULLED THE LEVER\n\nBETTER LEAVE IT THIS WAY';
    }

    update() {
        if (this.pushMessage && !this.pulled) {
            if (this.game.newMsg === false) {
                this.game.newMsg = true;
                this.game.msg = this.msg;
                this.pushMessage = false;
                this.pulled = true;
                this.game.gateTriggers[this.trigger] = true;
            }
        }
    }

    draw() {
        if (!this.pulled) {
            this.context.drawImage(this.spritesheet, 0, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60)
        } else {
            this.context.drawImage(this.spritesheet, 16, 0, 16, 16, this.hitbox.xMin - 6, this.hitbox.yMin - 6,
                60, 60)
        }
    }

}