var whipSound = new Howl({src: ['./res/sound/whip.wav']});
var jumpSound = new Howl({src: ['./res/sound/jump.mp3']});

class Hero extends Entity {
    /**
     * The entity that the player can control and play the game with.
     * @param game {GameEngine} The engine of the game for accessing
     * @param spriteSheet {Image} The image of the hero for animation and updating
     * @param weaponSheet {Image} The image of the default weapon for animation.
     * @param bowSheet {Image} Bow sprites for hero.
     */
    constructor(game, spriteSheet, weaponSheet, bowSheet) {
        super(game, 300, 420, 38, 55, 1);
        // To modify whip speed, change last parameter here (.100 default, attackFrameTime parameter in Animation).
        // Must be 1/5 of this.ACTION_DURATION (change that too).
        this.animation = new Animation(spriteSheet, this, 16, 23, .250,
            2.4, [2, 7, 11], .100);
        this.bowAnimation = new Animation(bowSheet, this, 36, 36, .250, 2.4, [4]);
        this.whip = new Weapon(game, weaponSheet, this, 84, 84, 2);
        this.context = game.GAME_CONTEXT;
        this.speed = 225;
        this.originalSpeed = 225;
        this.health = 10;
        this.maxHealth = 10;
        this.transitionDirection = 0; // Helper variable to keep track of what direction to transition
        this.coins = 0;
        this.smallKeys = 0;
        this.hasBossKey = false;
        this.alive = true;
        this.equipJ = "whip"; // Item equipped in J key.
        this.equipK = "empty"; // Item equipped in K key.
        this.inventory = ["empty", "whip"];
        this.nbx = {
            xMin: this.hitbox.xMin,
            yMin: this.hitbox.yMin,
            xMax: this.hitbox.xMax,
            yMax: this.hitbox.yMax
        };
        this.nby = {
            xMin: this.hitbox.xMin,
            yMin: this.hitbox.yMin,
            xMax: this.hitbox.xMax,
            yMax: this.hitbox.yMax
        };

        // array to store weapon upgrade levels
        // may need to expand on the elements as an object to include weapon name
        // upgrades[0] = whip, upgrades[1] = bow, upgrades[2] = weapon c, upgrades[3] = weapon d
        this.upgrades = [0, 0];
        // variable to count number of arrows
        // idea -> 1 unit of arrow represents a bundle of a dozen arrows (like a magazine clip)
        this.arrows = 0;

        // Change this to be 5x the attackFrameTime, and whip speed will update.
        // It is advised to adjust Entity's INVINCIBLE_TIME to match hero's whip duration. (Not Hero's).
        this.INVINCIBLE_TIME = 2;
        this.ACTION_DURATION = .5;
        this.JUMP_DURATION = .650;
        this.WHIP_ACTIVE_RATIO = .6;
        this.JUMP_SPRITE_FRAME_HEIGHT = 27; // Used in Animation for jump.

        // hero damage animation control variables
        this.hurting = false;
        this.hurtCounter = this.INVINCIBLE_TIME;
        this.whipSoundTag;
        this.jumpSoundTag;
        this.arrowShot;
    }

    walk(direction) {
        super.walk(direction);
        setBoxOnlyX(this.nbx, this.futureHitbox);
        setBoxOnlyY(this.nbx, this.hitbox);

        setBoxOnlyX(this.nby, this.hitbox);
        setBoxOnlyY(this.nby, this.futureHitbox);
    }

    update() {
        if (this.pushUpdateX) {
            setBoxOnlyX(this.hitbox, this.nbx);
        } else {
            setBoxToThis(this.nbx, this.hitbox);
        }
        if (this.pushUpdateY) {
            setBoxOnlyY(this.hitbox, this.nby);
        } else {
            setBoxToThis(this.nby, this.hitbox);
        }
        setBoxToThis(this.futureHitbox, this.hitbox);
        super.update();
    }


    /**
     * Predicts future hitbox based on inputs.
     */
    preUpdate() {

        if (!this.game.transition) {
            this.whip.active = this.actionElapsedTime >= (this.ACTION_DURATION * this.WHIP_ACTIVE_RATIO) && this.status === 'attacking';
            if (this.jumping) {
                this.jump();
            } else if (!this.jumping && this.beingUsed("boots") && this.status !== 'shooting') {
                this.jumping = true;
                this.jump();
            }
            if (this.status === 'attacking') {
                this.attack();
            } else if (this.status !== 'attacking' && this.beingUsed("whip")) {
                this.status = 'attacking';
                this.attack();
            } else if (this.status === 'shooting') {
                this.shoot();
            } else if (this.beingUsed("bow") && (this.status !== 'attacking' && !this.jumping)) {
                this.status = 'shooting';
                this.shoot();
                this.arrowShot = false;
            } else if (this.game.hasMoveInputs()) {
                this.status = 'walking';
                this.movingDiagonally = !!this.hasMultipleMoveInputs();
                if (this.movingDiagonally) {
                    this.speed *= this.game.DIAGONAL_ADJUSTMENT;
                }
                if (this.game.INPUTS["KeyW"]) {
                    this.direction = 0;
                    this.walk(this.direction);
                }
                if (this.game.INPUTS["KeyS"]) {
                    this.direction = 1;
                    this.walk(this.direction);
                }
                if (this.game.INPUTS["KeyA"]) {
                    this.direction = 2;
                    this.walk(this.direction);
                }
                if (this.game.INPUTS["KeyD"]) {
                    this.direction = 3;
                    this.walk(this.direction);
                }
                this.speed = this.originalSpeed;

            } else {
                this.status = 'idle';
            }
        }
    }

    /**
     * Moves the hero automatically based on the transition direction. This makes it look like the camera is panning while the hero is in place.
     */
    eventWalk() {

        const TRANSITION_AMOUNT_X = 10.65; // The amount of shift in the x direction when transitioning
        const TRANSITION_AMOUNT_Y = 10.37; // The amount of shift in the y direction when transitioning
        switch (this.transitionDirection) {
            case "up":
                this.hitbox.yMin = this.hitbox.yMin + TRANSITION_AMOUNT_Y; // Add top left y coordinate with the shift amount
                this.hitbox.yMax = this.hitbox.yMin + this.height; // Updates the new y max coordinate hitbox
                setBoxOnlyY(this.futureHitbox, this.hitbox);
                setBoxToThis(this.nbx, this.hitbox);
                setBoxToThis(this.nby, this.hitbox);
                break;
            case "down":
                this.hitbox.yMin = this.hitbox.yMin - TRANSITION_AMOUNT_Y; // Add top left y coordinate with the shift amount
                this.hitbox.yMax = this.hitbox.yMin + this.height; // Updates the new y max coordinate hitbox
                setBoxOnlyY(this.futureHitbox, this.hitbox);
                setBoxToThis(this.nbx, this.hitbox);
                setBoxToThis(this.nby, this.hitbox);
                break;
            case "left":
                this.hitbox.xMin = this.hitbox.xMin + TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
                this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
                setBoxOnlyX(this.futureHitbox, this.hitbox); // Updates the future hitbox to accommodate for the shifting
                // this.futureHitbox.xMin = this.hitbox.xMin;
                // this.futureHitbox.xMax = this.hitbox.xMax;
                setBoxToThis(this.nbx, this.hitbox);
                setBoxToThis(this.nby, this.hitbox);
                break;
            case "right":
                this.hitbox.xMin = this.hitbox.xMin - TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
                this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
                setBoxOnlyX(this.futureHitbox, this.hitbox);
                setBoxToThis(this.nbx, this.hitbox);
                setBoxToThis(this.nby, this.hitbox);
                break;
        }
        this.originalHitbox.xMin = this.hitbox.xMin;
        this.originalHitbox.xMax = this.hitbox.xMax;
        this.originalHitbox.yMin = this.hitbox.yMin;
        this.originalHitbox.yMax = this.hitbox.yMax;
    }

    /**
     * Draws the hero.
     */
    draw() {
        if (!this.hurting) {
           if (this.status !== 'shooting') {
               this.drawHeroHelper();
           } else {
               this.drawHeroShootHelper();
           }
        }
        if (this.hurting) {
            if (Math.floor(this.hurtCounter * 1000) % 3 !== 0) {
                if (this.status !== 'shooting') {
                    this.drawHeroHelper();
                } else {
                    this.drawHeroShootHelper();
                }

            } else {
                // draw nothing
            }

            this.hurtCounter -= this.game.clockTick;
            if (this.hurtCounter <= 0) {
                this.hurting = false;
                this.hurtCounter = this.INVINCIBLE_TIME;
            }
        }
    }

    drawHeroHelper() {
        this.animation.drawFrame(this.game.clockTick, this.context,
            this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status, this.direction);
    }

    drawHeroShootHelper() {
        this.bowAnimation.drawFrame(this.game.clockTick, this.context,this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR) - 20,
            this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR) - 16, this.status, this.direction);
    }

    /**
     * Checks to see if the hero is on the border of the Canvas. If he is, then we tell the game engine what border he is on.
     * @returns {{changeInX: number, changeInY: number}} a change in x or y that represents which tilemap. Used to add with sections in World to determine the border transition
     */
    checkBorder() {
        // Up Canvas Border
        if (this.hitbox.yMin < 0) {
            this.transitionDirection = "up";
            return {
                changeInX: -1,
                changeInY: 0
            };
        }

        // Right Canvas Border
        if (this.hitbox.xMax > this.game.GAME_CANVAS_WIDTH) {
            this.transitionDirection = "right";
            return {
                changeInX: 0,
                changeInY: 1
            };
        }

        // Down Canvas Border
        if (this.hitbox.yMax > this.game.GAME_CANVAS_HEIGHT) {
            this.transitionDirection = "down";
            return {
                changeInX: 1,
                changeInY: 0
            };
        }

        // Left Canvas Border
        if (this.hitbox.xMin < 0) {
            this.transitionDirection = "left";
            return {
                changeInX: 0,
                changeInY: -1
            };
        }

        // Still within border
        return {
            changeInX: 0,
            changeInY: 0
        };
    }

    jump() {
        if (!jumpSound.playing(this.jumpSoundTag) && this.jumpElapsedTime < .60) {
            this.jumpSoundTag = jumpSound.play();
        }
        this.jumpElapsedTime += this.game.clockTick;
        this.z = 1;
        if (this.jumpElapsedTime > this.JUMP_DURATION) {
            this.jumpElapsedTime = 0;
            this.jumping = false;
            this.z = 0;
        }

    }


    attack() {
        if (!whipSound.playing(this.whipSoundTag)) {
            this.whipSoundTag = whipSound.play();
        }
        this.whip.direction = this.direction;
        super.attack();
    }

    shoot() {
        super.attack();
        if (this.actionElapsedTime >= .75 && !this.arrowShot) {
            console.log("shooting 1 arrow!");
            this.arrowShot = true;
            switch (this.direction) {
                case 0:
                    this.vertarrow = new VerticalArrow(this.game, this.game.ASSETS_LIST["./res/img/vert_arrow.png"],
                        this.futureHitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR) + this.width / 2,
                        this.futureHitbox.yMin - 57, 'NORTH');
                    this.vertarrow.speed = 400;
                    this.game.currentEntities[0].push(this.vertarrow);
                    break;
                case 1:
                    this.vertarrow = new VerticalArrow(this.game, this.game.ASSETS_LIST["./res/img/vert_arrow.png"],
                        this.futureHitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR) + this.width / 2 + 2,
                        this.futureHitbox.yMin + 57, 'SOUTH');
                    this.vertarrow.speed = 400;
                    this.game.currentEntities[0].push(this.vertarrow);
                    break;
                case 2:
                    this.horizarrow = new HorizontalArrow(this.game, this.game.ASSETS_LIST["./res/img/horiz_arrow.png"],
                        this.futureHitbox.xMin - 57 - this.width / 2, this.futureHitbox.yMin + this.height / 2, "WEST");
                    this.horizarrow.speed = 400;
                    this.game.currentEntities[0].push(this.horizarrow);
                    break;
                case 3:
                    this.horizarrow = new HorizontalArrow(this.game, this.game.ASSETS_LIST["./res/img/horiz_arrow.png"],
                        this.futureHitbox.xMin + this.width, this.futureHitbox.yMin + this.height / 2, "EAST");
                    this.horizarrow.speed = 400;
                    this.game.currentEntities[0].push(this.horizarrow);
                    break;
            }
        }
    }

    beingUsed(itemName) {
        return (this.equipJ === itemName && this.game.INPUTS["KeyJ"]) || (this.equipK === itemName && this.game.INPUTS["KeyK"]);
    }

    hasMultipleMoveInputs() {
        return (this.game.INPUTS["KeyW"] || this.game.INPUTS["KeyS"]) && (this.game.INPUTS["KeyD"] || this.game.INPUTS["KeyA"]);
    }
}