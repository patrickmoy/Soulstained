/**
 *
 */
class Animation {
    /**
     * Constructor to create Animation object.
     * Class is written with a horizontally aligned sprite sheet in mind -
     * please ensure sprite sheet is formatted as such through Aseprite or Marmoset Hexels.
     * @param {Image} spriteSheet   Filepath of sprite sheet.
     * @param {number} frameHeight X coordinate to begin pulling sprite
     * @param {number} frameWidth Y coordinate to begin pull
     * @param {number} sheetWidth  X coordinate to stop
     * @param {number} singleFrameTime  Y coordinate to stop
     * @param {number} frameCount of animation in ms
     * @param {boolean} loop determine if the animation should loop
     * @param {number} scale image scaling to increase or decrease size
     */
    constructor(spriteSheet, entity, frameWidth, frameHeight, sheetWidth, singleFrameTime, frameCount, frameIndices, scale) {
        this.spriteSheet = spriteSheet;
        this.entity = entity;
        this.frameWidth = frameWidth;
        this.frameDuration = singleFrameTime;
        this.frameHeight = frameHeight;
        this.frameIndices = frameIndices;
        this.walkDuration = this.frameDuration * this.frameIndices[0];
        this.attackDuration = this.frameDuration * this.frameIndices[1];
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
     * TODO Make imageRow an optional parameter (at the end), defaulting to 0. Most enemies will ignore imageRow.
     */
    drawFrame(tick, context, gamePositionX, gamePositionY, imageRow, status) {

        let xIndex;
        if (status === 'walking') { // When walking, increment time by tick.
            this.walkTime += tick;
            if (this.walkTime >= this.walkDuration) { // Reset if we go over.
                this.walkTime -= this.walkDuration; // Should this value be "totalWalkDuration" or something?
            }
        }
        if (status === 'walking' || status === 'idle') {
            xIndex = Math.floor(this.currentFrame(this.walkTime)) % this.frameIndices[0]; // 2 should be "WALK_FRAMES"

        } else if (status === 'attacking') {
            xIndex = Math.floor(this.currentFrame(this.entity.actionElapsedTime)) % (this.frameIndices[1] - this.frameIndices[0]) +
            this.frameIndices[0];
            console.log(xIndex);
            console.log(imageRow);
        }
        context.drawImage(this.spriteSheet, xIndex * this.frameWidth, imageRow * this.frameHeight,
            this.frameWidth, this.frameHeight, gamePositionX, gamePositionY,
            this.frameWidth * this.scale, this.frameHeight * this.scale);
    }


    /**
     * Gets the current frame of the animation
     * @returns {number} the current frame.
     */
    currentFrame(time) {
        return Math.floor(time / this.frameDuration);
    }

    // /**
    //  * Checks if the animation is done
    //  * @returns {boolean} true if animation has completed all frames, false otherwise
    //  */
    // isDone() {
    //     return this.elapsedTime >= this.frameDuration * 2;
    // }
}