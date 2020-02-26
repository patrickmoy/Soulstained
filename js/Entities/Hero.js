var whipSound = new Howl({src: ['./res/sound/whip.wav']});
var jumpSound = new Howl({src: ['./res/sound/jump.mp3']});

class Hero extends Entity {
    /**
     * The entity that the player can control and play the game with.
     * @param game {GameEngine} The engine of the game for accessing
     * @param spriteSheet {Image} The image of the hero for animation and updating
     * @param weaponSheet {Image} The image of the default weapon for animation.
     */
    constructor(game, spriteSheet, weaponSheet) {
        super(game, 300, 420, 38, 55, 1);
        // To modify whip speed, change last parameter here (.100 default, attackFrameTime parameter in Animation).
        // Must be 1/5 of this.ACTION_DURATION (change that too).
        this.animation = new Animation(spriteSheet, this, 16, 23, .250,
            2.4, [2, 7, 11], .100);
        this.whip = new Weapon(game, weaponSheet, this, 84, 84, 2);
        this.context = game.GAME_CONTEXT;
        this.speed = 225;
        this.health = 10;
        this.maxHealth = 10;
        this.transitionDirection = 0; // Helper variable to keep track of what direction to transition
        this.coins = 0;
        this.smallKeys = 0;
        this.hasBossKey = false;
        this.alive = true;
        this.equipJ = "whip"; // Item equipped in J key.
        this.equipK; // Item equipped in K key.
        this.inventory = ["whip"];

        // Change this to be 5x the attackFrameTime, and whip speed will update.
        // It is advised to adjust Entity's INVINCIBLE_TIME to match hero's whip duration. (Not Hero's).
        this.INVINCIBLE_TIME = 2;
        this.ACTION_DURATION = .5;
        this.JUMP_DURATION = .650;
        this.WHIP_ACTIVE_RATIO = .6;
        this.JUMP_SPRITE_FRAME_HEIGHT = 27;

        // hero damage animation control variables
        this.hurting = false;
        this.hurtCounter = this.INVINCIBLE_TIME;
        this.whipSoundTag;
        this.jumpSoundTag;
    }

    /**
     * Predicts future hitbox based on inputs.
     */
    preUpdate() {

        if (!this.game.transition) {
            this.whip.active = this.actionElapsedTime >= (this.ACTION_DURATION * this.WHIP_ACTIVE_RATIO) && this.status === 'attacking';
            if (this.jumping) {
                this.jump();
            } else if (!this.jumping && this.beingUsed("boots")) {
                this.jumping = true;
                this.jump();
            }
            if (this.status === 'attacking') {
                this.attack();
            } else if (this.status !== 'attacking' && this.beingUsed("whip")) {
                this.status = 'attacking';
                this.attack();
            } else if (this.game.hasMoveInputs()) {
                this.status = 'walking';
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
                this.futureHitbox.yMin = this.hitbox.yMin; // Updates the future hitbox to accommodate for the shifting
                this.futureHitbox.yMax = this.hitbox.yMax;
                break;
            case "down":
                this.hitbox.yMin = this.hitbox.yMin - TRANSITION_AMOUNT_Y; // Add top left y coordinate with the shift amount
                this.hitbox.yMax = this.hitbox.yMin + this.height; // Updates the new y max coordinate hitbox
                this.futureHitbox.yMin = this.hitbox.yMin; // Updates the future hitbox to accommodate for the shifting
                this.futureHitbox.yMax = this.hitbox.yMax;
                break;
            case "left":
                this.hitbox.xMin = this.hitbox.xMin + TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
                this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
                this.futureHitbox.xMin = this.hitbox.xMin; // Updates the future hitbox to accommodate for the shifting
                this.futureHitbox.xMax = this.hitbox.xMax;
                break;
            case "right":
                this.hitbox.xMin = this.hitbox.xMin - TRANSITION_AMOUNT_X; // Add top left x coordinate with the shift amount
                this.hitbox.xMax = this.hitbox.xMin + this.width; // Updates the new x max coordinate to include the new width point
                this.futureHitbox.xMin = this.hitbox.xMin; // Updates the future hitbox to accommodate for the shifting
                this.futureHitbox.xMax = this.hitbox.xMax;
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
            this.animation.drawFrame(this.game.clockTick, this.context,
                this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status, this.direction);
        }
        if (this.hurting) {
            if (Math.floor(this.hurtCounter * 1000) % 3 !== 0) {
                this.animation.drawFrame(this.game.clockTick, this.context,
                    this.hitbox.xMin - this.width * (1 - this.HITBOX_SHRINK_FACTOR),
                    this.hitbox.yMin - this.height * (1 - this.HITBOX_SHRINK_FACTOR), this.status, this.direction);
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

    beingUsed(itemName) {
        return (this.equipJ === itemName && this.game.INPUTS["KeyJ"]) || (this.equipK === itemName && this.game.INPUTS["KeyK"]);
    }

    checkSmallKeyInventory() {

        let smallKeyCount = Object.keys(this.key).length;

    }
    checkBossKeyInventory() {

        let bossKeyCount = Object.keys(this.bossKey).length;
    }
    acquireSmallKey() {

        this.key[this.smallKeyCounter] = 'key';
        this.smallKeyCounter++;

    }
    acquireBossKey() {

        this.key[this.bossKeyCounter] = 'Bkey';
        this.bossKeyCounter++;

    }
}