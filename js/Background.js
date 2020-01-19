class Background
{
	constructor(game, backgroundImage)
	{
		//
    this.SOURCE_SHIFT = 7;
		this.sourceX = 0;
		this.sourceY = 0;
		this.sourceWidth = 192;
		this.sourceHeight = 192;
    this.MIN_X = 0;
    this.MIN_Y = 0;
    this.MAX_X = backgroundImage.width - this.sourceWidth;
    this.MAX_Y = backgroundImage.height - this.sourceHeight;
		this.spriteSheet = backgroundImage;
		this.game = game;
		this.ctx = this.game.ctx;
	}

	draw()
	{
		this.ctx.drawImage(this.spriteSheet, this.sourceX, this.sourceY,
                       this.sourceWidth, this.sourceHeight, 0, 0,
                       this.ctx.canvas.width, this.ctx.canvas.height - 150);
	}

	update()
	{
    // Can't update to next window with the prototype because of how the keys are polled
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
