// TODO update the enemies with the new entity parameters - Steven Tran
class Enemy extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height, 1);
    }
}

class Zombie extends Enemy {
    /**
     *  A basic zombie enemy in the game. One of the more populated enemies that attacks the hero when.
     */
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, this,16, 16, .450, 3.5);
        this.context = game.GAME_CONTEXT;
        this.speed = 100;
        this.direction = 1;
        this.health = 2;
        this.pushUpdate = false;
    }


    draw() {
        // this.context.beginPath();
        //         // this.context.rect(this.x, this.y, this.width, this.height);
        //         // this.context.stroke();
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status);
    }

    pickDirection() {
        this.direction = Math.floor(Math.random() * Math.floor(5));
    }

}


class Knight extends Enemy {

}

class Skeleton extends Enemy {

}
