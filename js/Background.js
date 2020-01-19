class Background
{
	constructor(game, backgroundImage)
	{
    this.SOURCE_SHIFT_X = 2;
    this.SOURCE_SHIFT_Y = 2;
		this.sourceX = 0;
		this.sourceY = 0;
		this.sourceWidth = 180;
		this.sourceHeight = 150;
    this.MIN_X = 0;
    this.MIN_Y = 0;
    this.MAX_X = backgroundImage.width;
    this.MAX_Y = backgroundImage.height;
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
      if (this.sourceY >= this.MIN_Y)
      {
        this.sourceY -= this.SOURCE_SHIFT_Y;
      }
      else
      {
        console.log("Upper height bound reached");
      }
		}
		if (this.game.inputs["KeyA"])
		{
      if (this.sourceX >= this.MIN_X)
      {
        this.sourceX -= this.SOURCE_SHIFT_X;
      }
      else
      {
        console.log("Left width bound reached");
      }

		}

		if (this.game.inputs["KeyS"])
		{
      if (this.sourceY <= this.MAX_Y)
      {
        this.sourceY += this.SOURCE_SHIFT_Y;
        console.log("X: " + this.sourceX + " Y: " + this.sourceY);
      }
      else
      {
        console.log("Lower height bound reached");
      }
		}

		if (this.game.inputs["KeyD"])
		{
      if (this.sourceX <= this.MAX_X)
      {
        this.sourceX += this.SOURCE_SHIFT_X;
        console.log("X: " + this.sourceX + " Y: " + this.sourceY);
      }
      else
      {
        console.log("Right width bound reached");
      }

		}
	}
}
