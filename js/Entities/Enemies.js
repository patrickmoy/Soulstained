// TODO update the enemies with the new entity parameters - Steven Tran
class Enemy extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height, 0);
        this.context = game.GAME_CONTEXT;
    }
}

class Crab extends Enemy {

    constructor(game, spritesheet, x, y, width, height)
    {
        super(game, x, y, width, height);
        this.spritesheet = new Animation(spritesheet, 16, 16, 2, .25, 2, true, 2.3);
        this.health = 2;
        this.speed = 100;

        this.direction;

    }

    preUpdate()
    {
        this.direction = Math.floor(Math.random() * 4.5); // Gets a random direction.
        console.log(this.direction);
        this.walk(this.direction);
    }

    draw()
    {
        this.spritesheet.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 0, 'moving');
    }
}

class Zombie extends Enemy {
    /**
     *  A basic zombie enemy in the game. One of the more populated enemies that attacks the hero when.
     */
    constructor(game, spritesheet, x, y, width, height) {
        super(game, x, y, width, height);
        this.animation = new Animation(spritesheet, 16, 16, 2, .450, 2, true, 3.5);
        this.speed = 100;
        this.direction = 1;
        this.health = 4;
        this.pushUpdate = false;
    }


    draw() {
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 0, 'dancing');
    }

    pickDirection() {
        this.direction = Math.floor(Math.random() * Math.floor(5));
    }
}


class Knight extends Enemy {

}

class Skeleton extends Enemy {

}
