/**
 *
 */
class Entity {

    /**
     * An object in the game that has some form of interaction. An example would be walls or the hero.
     * A hero interacts with walls where he can't walk through them.
     * @param game {GameEngine} Current instance of the game
     * @param x {number} the x position of the entity relative to the canvas
     * @param y {number} the y position of the entity relative to the canvas
     * @param width {number} the width of the entity in pixels
     * @param height {number} the height of the entity in pixels
     * @param layerLevel {number} TODO unsure yet
     */
    constructor(game, x, y, width, height, layerLevel) {
        this.HITBOX_SHRINK_FACTOR = .9;
        this.game = game;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.hitbox = // The entity's box to take be interacted with other entities or world components.
            {
                xMin: x + width * (1 - this.HITBOX_SHRINK_FACTOR),
                yMin: y + height * (1 - this.HITBOX_SHRINK_FACTOR),
                xMax: x + width * this.HITBOX_SHRINK_FACTOR,
                yMax: y + height * this.HITBOX_SHRINK_FACTOR,
            };
        this.futureHitbox = {
            xMin: x + width * (1 - this.HITBOX_SHRINK_FACTOR),
            yMin: y + height * (1 - this.HITBOX_SHRINK_FACTOR),
            xMax: x + width * this.HITBOX_SHRINK_FACTOR,
            yMax: y + height * this.HITBOX_SHRINK_FACTOR,
        };

        this.direction = 1; // Looking down at default;
        // Where the hero is facing. North = 0, South = 1, East = 2, West = 3. //
        // PM: Spritesheet convention (only some entities have diff animations for directions)
        // Therefore, only those such entities should pass this.direction in.

        this.status = 'idle'; // PM: New parameter I'm adding to govern "state". Idle, attacking, walking. Firmly of the
        // belief that this should be stored in entity state -> animation can make use of this.
        // Acceptable states currently: 'idle', 'walking', 'attacking' (some enemies and hero).
        // Considering changing 'attacking' to "action" and then having action depend on the equippped
        // item, which should also be stored in Hero.
        this.isDead = false;
        this.Dying = false;
        this.moveable = true;
        this.pushUpdate = true; // Used for collision to check if entity's new Hitbox should be pushed for new update with the new hit box or not.
                                // Is changed by collision detection
    }

    /**
     *
     */
    preUpdate() {
        // Do nothing, implemented by subclasses
    }

    /**
     *
     */
    update() {
        if (this.pushUpdate) {
            this.hitbox.xMin = this.futureHitbox.xMin; // Updates to new top left x coordinate
            this.hitbox.yMin = this.futureHitbox.yMin; // Updates to the new top left y coordinate
            this.hitbox.xMax = this.futureHitbox.xMax; // Updates to the new bottom right x coordinate
            this.hitbox.yMax = this.futureHitbox.yMax; // Updates to the new bottom right y coordinate
        }
        else {
            this.futureHitbox.xMin = this.hitbox.xMin; // Resets future top left x coordinate
            this.futureHitbox.yMin = this.hitbox.yMin; // Resets future top left y coordinate
            this.futureHitbox.xMax = this.hitbox.xMax; // Resets future bottom right x coordinate
            this.futureHitbox.yMax = this.hitbox.yMax; // Resets future bottom right y coordinate
        }
    }

    // Sets status of entity to walking for this update/render tick, and updates hitbox.
    walk(direction) {
        switch (direction) {
            case 0:
                this.futureHitbox.yMin -= this.game.clockTick * this.speed;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                break;
            case 1:
                this.futureHitbox.yMin += this.game.clockTick * this.speed;
                this.futureHitbox.yMax = this.futureHitbox.yMin + this.height;
                break;
            case 2:
                this.futureHitbox.xMin -= this.game.clockTick * this.speed;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                break;
            case 3:
                this.futureHitbox.xMin += this.game.clockTick * this.speed;
                this.futureHitbox.xMax = this.futureHitbox.xMin + this.width;
                break;

        }
        this.futureHitbox.xMin = Math.floor(this.futureHitbox.xMin); // Normalize the x min coordinate for consistency
        this.futureHitbox.xMax = Math.floor(this.futureHitbox.xMax); // Normalize the x max coordinate for consistency
        this.futureHitbox.yMin = Math.floor(this.futureHitbox.yMin); // Normalize the y min coordinate for consistency
        this.futureHitbox.yMax = Math.floor(this.futureHitbox.yMax); // Normalize the y max coordinate for consistency
    }


    /**
     * Draws the entity
     */
    draw() {
        // Do nothing, implemented by subclasses
    }
}