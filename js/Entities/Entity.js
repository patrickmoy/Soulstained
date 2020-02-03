/**
 *
 */
export class Entity
{
	/**
	 *
	 * @param game {GameEngine} Current instance of the game
	 * @param x {number} the x position of the entity relative to the canvas
	 * @param y {number} the y position of the entity relative to the canvas
	 * @param width {number} the width of the entity in pixels
	 * @param height {number} the height of the entity in pixels
	 * @param layerLevel {number}
	 */
	constructor(game, x, y, width, height, layerLevel)
	{
		this.game = game;
		this.hitbox = // The entity's box to take be interacted with other entities or world components.
			{
				xMin: x,
				yMin: y,
				xMax: x + width,
				yMax: y + height
			};
		this.futureHitBox =
			{
				xMin: x,
				yMin: y,
				xMax: x + width,
				yMax: y + height
			};

		this.isDead = false;
		this.Dying = false; // ? What is this for ?. Used for death animation. Not sure yet.
		this.moveable = true;
		this.pushUpdate = false; // Used for collision to check if entity's new hitbox should be pushed for new update with the new hit box or not.
		// Is changed by collision detection
		// TODO need new name.
	}

	/**
	 *
	 */
	preupdate()
	{
		// Do nothing, implemented by subclasses
	}

	/**
	 *
	 */
	update()
	{
		if (this.pushUpdate)
		{
			this.hitbox.xMin = this.futureHitBox.xMin; // Updates to new top left x coordinate
			this.hitbox.yMin = this.futureHitBox.yMin; // Updates to the new top left y coordinate
			this.hitbox.xMax = this.futureHitBox.xMax; // Updates to the new bottom right x coordinate
			this.hitbox.yMax = this.futureHitBox.yMax; // Updates to the new bottom right y coordinate
			this.pushUpdate = false; // Resets push update for future checks
		}
		else
		{

		}
	}
}