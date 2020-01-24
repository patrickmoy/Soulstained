class Hero extends Entity
{
	constructor(game, spritesheet)
	{
		super(game, 250, 310);
		this.animation = new Animation(spritesheet, 32, 48, 8, .150, 8, true, 1.75);
		this.ctx = game.ctx;
		this.speed = 500;
		this.direction = 1;
	}

	//spriteSheet, frameWidth, frameHeight, sheetWidth, singleFrameTime, frameCount, loop, scale
	update()
	{

		if (this.game.inputs["KeyW"])
		{
			// Moving up so direction is 0, thus the corresponding row in the sprite sheet to load for animation is 0.
			// The same applies to other directions.
			this.direction = 0;
			this.y -= this.game.clockTick * this.speed;
		}
		if (this.game.inputs["KeyS"])
		{
			this.direction = 1;
			this.y += this.game.clockTick * this.speed;
		}
		if (this.game.inputs["KeyA"])
		{
			this.direction = 2;
			this.x -= this.game.clockTick * this.speed;
		}

		if (this.game.inputs["KeyD"])
		{
			this.direction = 3;
			this.x += this.game.clockTick * this.speed;
		}
		this.face = this.game.heroFace;
	}

	draw()
	{
		// This assumes each row corresponds to a separate animation. However, this is not always the case depending on our own design of spritesheet files.
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.direction);
	}

}
