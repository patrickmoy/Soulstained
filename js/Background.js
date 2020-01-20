class Background
{
	constructor(game, backgroundImage)
	{
		// The amount of shifting
    this.SOURCE_SHIFT = 7;

		// coordinates of background image
		this.sourceY = 0;
		this.sourceX = 0;

		// Size of background image to crop and use
		this.sourceSize = 192

		// Minimum X coordinate for the camera
    this.MIN_X = 0;

		// Minimum Y coordinate for the camera
    this.MIN_Y = 0;

		// Maximum X coordinate for the camera
    this.MAX_X = backgroundImage.width - this.sourceSize;

		// Maximum Y coordinate for the camera
    this.MAX_Y = backgroundImage.height - this.sourceSize;

		this.spriteSheet = backgroundImage;
		this.game = game;
		this.ctx = this.game.ctx;
	}

	draw()
	{
		this.ctx.drawImage(this.spriteSheet, this.sourceX, this.sourceY,
                       this.sourceSize, this.sourceSize, 0, 0,
                       this.ctx.canvas.width, this.ctx.canvas.height - 150);
	}

	update()
	{
    // Can't update to next window with the prototype because of how the keys are polled

		// Depending on key press, camera coordinates will move.
		if (this.game.inputs["KeyW"])
		{
      this.sourceY -= this.SOURCE_SHIFT;
		}
		if (this.game.inputs["KeyA"])
		{
      this.sourceX -= this.SOURCE_SHIFT;
		}

		if (this.game.inputs["KeyS"])
		{
			this.sourceY += this.SOURCE_SHIFT;
		}

		if (this.game.inputs["KeyD"])
		{
			this.sourceX += this.SOURCE_SHIFT;
		}
		// Checks the bounds to ensure we are still within the background image.
		this.checkBounds();
		console.log("(x, y) = (" + this.sourceX + ", " + this.sourceY + ")");
	}

	checkBounds()
	{
		if (this.sourceY < this.MIN_Y)
		{
			this.sourceY = this.MIN_Y;
		}
		else if (this.sourceY > this.MAX_Y)
		{
			this.sourceY = this.MAX_Y;
		}

		if (this.sourceX < this.MIN_X)
		{
			this.sourceX = this.MIN_X;
		}
		else if(this.sourceX > this.MAX_X)
		{
			this.sourceX = this.MAX_X;
		}
	}
}
