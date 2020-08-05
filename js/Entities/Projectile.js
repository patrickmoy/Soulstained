class Projectile extends Entity {

    constructor(game, x, y, width, height, layerLevel = 2) {
        super(game, x, y, width, height, 1);
        this.context = game.GAME_CONTEXT;
        this.width = width;
        this.height = height;
    }

    projectileNotOnScreen() {

        return (this.hitbox.xMin > this.game.GAME_CANVAS_WIDTH
            || this.hitbox.yMin > this.game.GAME_CANVAS_HEIGHT
            || this.hitbox.xMin < 0
            || this.hitbox.yMin < 0);

    }

}


class FireballProjectile extends Projectile {
    constructor(game, spritesheet, x, y, trajectory, attack, secondary) {
        super(game, x, y, 56, 56, 2);
        this.animation = new Animation(spritesheet, this, 97, 103, .15, 1, [15]);
        this.context = game.GAME_CONTEXT;
        this.alive = true; //Every projectile is spawned dead.
        this.trajectory = trajectory; //A flight direction path of either: left, right or down.
        this.radians = 0; //Used for wave-like and circular movements.
        this.velocity = 0.05; //Used for wave-like and circular movements.
        this.speed = 100; //Speed of each projectile, presently hard-coded in.
        this.b = 5; //Y-intercept for sloped movement.
        this.m = 500; //Slope for right sided projectiles.
        this.m1 = -500; //Slope for left sided projectiles.
        this.att = attack;
        this.att2 = secondary;
        this.origX = x;

    }

    //Update constantly calls the down direction and selects the attack passed in by the entity.
    preUpdate() {


        this.futureHitbox.yMin += this.game.clockTick * this.speed;
        this.futureHitbox.yMax += this.game.clockTick * this.speed;
        this.selectAttack(this.att);
    };

    //Draws the projectile
    draw() {
        if (this.alive) {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }
    }

    //Selects attack method.
    selectAttack(attack) {


        switch (attack) {
            case 0:
                this.double();
                break;

            case 1:
                this.triple();
                break;

            case 2:
                this.wave();
                break;

            case 3:
                this.expand();
                break;
        }


    }

    //Two fireballs: Down and left fireball or down and right fireball ONLY.
    double() {


        if (this.trajectory === 'down') {
            // this.futureHitbox.yMin += this.game.clockTick * this.speed;

        } else if (this.att2 === 0) { // kills right fireball

            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m);
            if (this.trajectory === 'right') {
                this.alive = false;
            }

        } else if (this.att2 === 1) { //kills left fireball
            // this.alive = true;
            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m1);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m1);
            if (this.trajectory === 'left') {
                this.alive = false;
            }
        }
    };

    //Three fire balls: left, right and down.
    triple() {

        if (this.trajectory === 'down') {

        } else if (this.trajectory === 'left') {

            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m);

        } else if (this.trajectory === 'right') {

            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m1);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m1);

        }

    };

    //Three fireballs: left, right and a cosine-wave-like fireball.
    wave() {

        if (this.trajectory === 'down') {

            this.radians += this.velocity;
            this.futureHitbox.xMin += Math.cos(this.radians) * 2;
            this.futureHitbox.xMax += Math.cos(this.radians) * 2;
        } else if (this.trajectory === 'left') {

            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m);

        } else if (this.trajectory === 'right') {

            this.futureHitbox.xMin += ((this.futureHitbox.yMin - this.b) / this.m1);
            this.futureHitbox.xMax += ((this.futureHitbox.yMax - this.b) / this.m1);

        }

    };

    //A fireball that is scaled by 3 times its size.
    expand() {

        if (this.trajectory === 'down') {
            this.animation.scale = 3;
            this.futureHitbox.xMin = this.origX * .65; //hard coded for now but places fireball ~beneath necromancer.
        } else if (this.trajectory === 'left') {
            this.alive = false;
        } else if (this.trajectory === 'right') {
            this.alive = false;
        }

    }

}

class Hadouken extends Projectile {
    constructor(game, spritesheet, x, y, trajectory) {
        super(game, x, y, 42, 42, 2);
        this.animation = new Animation(spritesheet, this, 42, 42, .10, 1, [8]);
        this.context = game.GAME_CONTEXT;
        this.alive = true;
        this.trajectory = trajectory;
        this.speed = 400;
    }

    draw() {
        if (!this.game.pause) {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }
    }

    preUpdate() {
        switch(this.trajectory) {
            case 'SOUTH':
                this.futureHitbox.yMin += this.game.clockTick * this.speed;
                this.futureHitbox.yMax += this.game.clockTick * this.speed;
                if (this.projectileNotOnScreen()) {
                    this.alive = false;
                }
                break;
            case 'NORTH':
                this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                this.futureHitbox.yMax -= this.game.clockTick * this.speed;
                if (this.projectileNotOnScreen()) {
                    this.alive = false;
                }
                break;
            case 'EAST':
                this.futureHitbox.xMin += this.game.clockTick * this.speed;
                this.futureHitbox.xMax += this.game.clockTick * this.speed;
                if (this.projectileNotOnScreen()) {
                    this.alive = false;
                }
                break;
            case 'WEST':
                this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                this.futureHitbox.xMax -= this.game.clockTick * this.speed;
                if (this.projectileNotOnScreen()) {
                    this.alive = false;
                }
                break;
        }
    }
}

class VerticalArrow extends Projectile {

    constructor(game, spritesheet, x, y, trajectory) {
        super(game, x, y, 4, 57, 2);
        this.animation = new Animation(spritesheet, this, 4, 57, .10, 1, [1]);
        this.context = game.GAME_CONTEXT;
        this.alive = true;
        this.trajectory = trajectory; //A flight direction path of either: left, right or down.
        this.speed = 200; //Speed of each projectile, presently hard-coded in.
    }

    preUpdate() {


        this.selectPosition(this.trajectory);


    };

    //Draws the projectile
    draw() {
        if (!this.game.pause && this.trajectory === 'SOUTH') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 1);
        }
        if (!this.game.pause && this.trajectory === 'NORTH') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }

    }

    south() {

        this.futureHitbox.yMin += this.game.clockTick * this.speed;
        this.futureHitbox.yMax += this.game.clockTick * this.speed;
        if (this.projectileNotOnScreen()) {
            this.alive = false;
        }
    }

    north() {

        this.futureHitbox.yMin -= this.game.clockTick * this.speed;
        this.futureHitbox.yMax -= this.game.clockTick * this.speed;
        if (this.projectileNotOnScreen()) {
            this.alive = false;
        }
    }


    selectPosition(direction) {

        switch (direction) {
            case 'SOUTH':
                this.south();
                break;

            case 'NORTH':
                this.north();
                break;


        }
    }
}

class HorizontalArrow
    extends Projectile {

    constructor(game, spritesheet, x, y, trajectory) {
        super(game, x, y, 55, 4, 2);
        this.animation = new Animation(spritesheet, this, 55, 4, .10, 1, [1]);
        this.context = game.GAME_CONTEXT;
        this.alive = true;
        this.trajectory = trajectory; //A flight direction path of either: left, right or down.
        this.speed = 200; //Speed of each projectile, presently hard-coded in.


    }

    preUpdate() {


        this.selectPosition(this.trajectory);


    };

    //Draws the projectile
    draw() {

        if (!this.game.pause && this.trajectory === 'EAST') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 1);
        }
        if (!this.game.pause && this.trajectory === 'WEST') {
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), 'walking', 0);
        }
    }

    east() {

        this.futureHitbox.xMin += this.game.clockTick * this.speed;
        this.futureHitbox.xMax += this.game.clockTick * this.speed;
        if (this.projectileNotOnScreen()) {
            this.alive = false;
        }
    }

    west() {

        this.futureHitbox.xMin -= this.game.clockTick * this.speed;
        this.futureHitbox.xMax -= this.game.clockTick * this.speed;
        if (this.projectileNotOnScreen()) {
            this.alive = false;
        }
    }

    selectPosition(direction) {

        switch (direction) {
            case 'EAST':
                this.east();
                break;
            case 'WEST':
                this.west();
                break;
        }
    }
}
