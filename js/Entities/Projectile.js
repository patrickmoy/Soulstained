class FireballProjectile extends Entity {

    // constructor(game, spritesheet, x, y, trajectory, attack, secondary) {
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
        // this.xMin = this.futureHitbox.xMin;




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
            console.log(this.futureHitbox.xMin);

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
    projectileNotOnScreen() {

        return (this.hitbox.xMin > this.game.GAME_CANVAS_WIDTH
            || this.hitbox.yMin > this.game.GAME_CANVAS_HEIGHT
            || this.hitbox.xMin < 0
            || this.hitbox.yMin < 0);
        // return (this.futureHitbox.xMin > this.game.GAME_CANVAS_WIDTH
        //     || this.futureHitbox.yMin > this.game.GAME_CANVAS_HEIGHT
        //     || this.futureHitbox.xMin < 0
        //     || this.futureHitbox.yMin < 0);

    }

    /**
     * Resets the position of an enemy (primarily used when transitioning)
     */
    // resetFireBallPosition(x , y, x2, y2) {
    //     this.futureHitbox.xMin = x;
    //     this.futureHitbox.yMin = y;
    //     this.futureHitbox.xMax = x2;
    //     this.futureHitbox.yMax = y2;
    //
    // }


}