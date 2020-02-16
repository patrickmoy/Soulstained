/**
 *
 */
class Animation {
    /**
     * Constructor to create Animation object.
     * Class is written with a horizontally aligned sprite sheet in mind -
     * please ensure sprite sheet is formatted as such through Aseprite or Marmoset Hexels.
     * @param {Image} spriteSheet Filepath of sprite sheet.
     * @param {Entity} entity that has the animation (pass {this}).
     * @param {number} frameHeight X coordinate to begin pulling sprite
     * @param {number} frameWidth Y coordinate to begin pull
     * @param {number} singleFrameTime  Time for single frame of standard loop.
     * @param {Array} frameIndices Array [x,y], where x is the frame at which the walk/default animation ends, and y is
     * the frame at which the attack animation (if any) ends. Defaults to [2] (assuming only 2 frames, only walking).
     * @param {number} scale Image scaling ratio to increase or decrease size.
     * @param attackFrameTime Optional, attack frame time (if there is an attack animation).
     */
    constructor(spriteSheet, entity, frameWidth, frameHeight, singleFrameTime, scale, frameIndices = [2], attackFrameTime = 0) {
        this.spriteSheet = spriteSheet;
        this.entity = entity;
        this.frameWidth = frameWidth;
        this.standardFrameTime = singleFrameTime;
        this.attackFrameTime = attackFrameTime;
        this.frameHeight = frameHeight;
        this.frameIndices = frameIndices;
        this.walkDuration = this.standardFrameTime * this.frameIndices[0]; // Total duration only needed for loops.
        this.scale = scale;
        this.walkTime = 0;
    }

    /**
     * Draws the current frame in the animation
     * @param tick {number} current in game time change
     * @param context {CanvasRenderingContext2D} the canvas to draw to
     * @param gamePositionX {number} x position relative to the canvas
     * @param gamePositionY {number} y position relative to the canvas
     * @param imageRow {number} the row to select which image, pass
     * @param status {string} the status of the object
     */
    drawFrame(tick, context, gamePositionX, gamePositionY, status, imageRow = 0) {

        let xIndex;
        let yIndex = imageRow * this.frameHeight;
        if (status === 'walking') { // When walking, increment time by tick.
            this.walkTime += tick;
            if (this.walkTime >= this.walkDuration) { // Reset if we go over.
                this.walkTime -= this.walkDuration; // Should this value be "totalWalkDuration" or something?
            }
        }
        if (status === 'walking' || status === 'idle') {
            xIndex = this.frameWidth * (Math.floor(this.currentFrame(this.walkTime)) % this.frameIndices[0]);
        } else if (status === 'attacking') {
            xIndex = this.frameWidth * (Math.floor(this.currentFrame(this.entity.actionElapsedTime)) %
                (this.frameIndices[1] - this.frameIndices[0]) + this.frameIndices[0]);
        } else if (status === 'weapon') {
            xIndex = 0;
            if (this.entity.direction <= 1) {
                yIndex = this.frameHeight * this.entity.direction;
            } else {
                //yIndex = (this.frameHeight * (this.entity.direction - this.entity.WHIP_SPRITE_OFFSET) + (this.entity.WHIP_SPRITE_OFFSET * this.frameWidth));
                yIndex = this.entity.WHIP_SPRITE_OFFSET * (this.frameWidth - this.frameHeight) + this.frameHeight * this.entity.direction;
            }

        }
        context.drawImage(this.spriteSheet, xIndex, yIndex,
            this.frameWidth, this.frameHeight, gamePositionX, gamePositionY,
            this.frameWidth * this.scale, this.frameHeight * this.scale);
    }


    /**
     * Gets the current frame of the animation
     * @returns {number} the current frame.
     */
    currentFrame(time) {
        if (this.entity.status === 'attacking') {
            return Math.floor(time / this.attackFrameTime);
        }
        return Math.floor(time / this.standardFrameTime);
    }

    // /**
    //  * Checks if the animation is done
    //  * @returns {boolean} true if animation has completed all frames, false otherwise
    //  */
    // isDone() {
    //     return this.elapsedTime >= this.frameDuration * 2;
    // }
}