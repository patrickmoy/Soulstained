import {Entity} from "./Entity.js";
import {Animation} from "./Animation.js";
/**
 *
 */
export class Hero extends Entity
{
	/**
	 *
	 * @param game {GameEngine} The engine of the game for accessing
	 * @param spritesheet {Image} The image of the hero for animation and updating
	 */
	constructor(game, spritesheet)
	{
		// TODO find right width and height for hero
		super(game, 300, 570, 56, 84, 0);
		this.animation = new Animation(spritesheet, 32, 48, 8, .150, 8, true, 1.75);
		this.context = game.GAME_CONTEXT;
		this.speed = 250;
		this.direction = 1;
	}

	update()
	{
		if (!this.game.transition)
		{
			if (this.game.INPUTS["KeyW"])
			{
				// Moving up so direction is 0, thus the corresponding row in the sprite sheet to load for animation is 0.
				// The same applies to other directions.
				this.direction = 0;
				this.y -= this.game.clockTick * this.speed;
			}
			if (this.game.INPUTS["KeyS"])
			{
				this.direction = 1;
				this.y += this.game.clockTick * this.speed;
			}
			if (this.game.INPUTS["KeyA"])
			{
				this.direction = 2;
				this.x -= this.game.clockTick * this.speed;
			}

			if (this.game.INPUTS["KeyD"])
			{
				this.direction = 3;
				this.x += this.game.clockTick * this.speed;
			}
		}
	}

	draw()
	{
		this.animation.drawFrame(this.game.clockTick, this.context, this.x, this.y, this.direction);
	}

	checkBounds()
	{
		// Up Canvas Border
		if (this.y < 0)
		{
			return {direction: "vertical", change: -1};
		}

		// Right Canvas Border
		if (this.x > this.game.canvasWidth)
		{
			return {direction: "horizontal", change: 1};
		}

		// Down Canvas Border
		if (this.y > this.game.canvasHeight)
		{
			return {direction: "vertical", change: 1};
		}

		// Left Canvas Border
		if (this.x < 0)
		{
			return {direction: "horizontal", change: -1};
		}

		// Still within border
		return {direction: "", change: 0};
	}

}
