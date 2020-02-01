class Hero extends Entity
{
	constructor(game, spritesheet)
	{
		super(game, 300, 570, 32 * 1.75, 48 * 1.75);
		this.animation = new Animation(spritesheet, 32, 48, 8, .150, 8, true, 1.75);
		this.ctx = game.ctx;
		this.speed = 250;
		this.direction = 1;
	}

	//spriteSheet, frameWidth, frameHeight, sheetWidth, singleFrameTime, frameCount, loop, scalecoll
	update()
	{

		if (!this.game.transition)
		{
			this.skipUpdate = false; 
			if (this.game.inputs["KeyW"]) {
				// Moving up so direction is 0, thus the corresponding row in the sprite sheet to load for animation is 0.
				// The same applies to other directions.
				this.direction = 0;
				this.newY = this.y - this.game.clockTick * this.speed;
			}
			if (this.game.inputs["KeyS"]) {
				this.direction = 1;
				this.newY = this.y + this.game.clockTick * this.speed;
			}
			if (this.game.inputs["KeyA"]) {
				this.direction = 2;
				this.newX = this.x - this.game.clockTick * this.speed;
			}
			if (this.game.inputs["KeyD"]) {
				this.direction = 3;
				this.newX = this.x + this.game.clockTick * this.speed;
			}
			this.predictBox();
			/*
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
			*/
		}
	}

	draw()
	{
		// This assumes each row corresponds to a separate animation. However, this is not always the case depending on our own design of spritesheet files.
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.direction);
	}

	checkBounds()
	{
		// Up Canvas Border
		if (this.y < 0)
		{
			return {direction: "vertical", change: -1};
		}

		// Right Canvas Border
		if (this.x + this.width > this.game.canvasWidth)
		{
			return {direction: "horizontal", change: 1};
		}

		// Down Canvas Border
		if (this.y + this.height > this.game.canvasHeight)
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
