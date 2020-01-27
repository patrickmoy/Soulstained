class Background
{
	constructor(game, backgroundImage)
	{
		// The amount of shifting
    this.SOURCE_SHIFT = 3;

		// coordinates of background image
		this.sourceY = 0;
		this.sourceX = 0;

		// Size of background image in pixels to crop and use
		this.sourceSize = 192;

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

	// A lot of the issues is trying to bound check. When you're doing a specific value say shift by 11. It's not always right because we are dealing both with the tiles and the pixels.
	// Tiles != pixels
	update(section)
	{
		// Bug: due to exact checking, the screen will move left and right if the player's x and y are a certain value(s)
		// Minor bug: going in the corners of the map such that player's x and y are negative will result undesired camera movement.
		// TODO figure out shifting hero but not in the background file
		var newSourceX = section.x * this.sourceSize;
		var newSourceY = section.y * this.sourceSize;

		if (this.sourceY < newSourceY)
		{
			this.shiftDown();
			this.game.hero.y -= 11.1;
			this.game.hero.y = Math.ceil(this.game.hero.y);
		}

		if (this.sourceY > newSourceY)
		{
			this.shiftUp();
			this.game.hero.y += 11.1;
			this.game.hero.y = Math.floor(this.game.hero.y);
		}

		if (this.sourceX > newSourceX)
		{
			this.shiftLeft();
			this.game.hero.x += 11.1;
			this.game.hero.x = Math.floor(this.game.hero.x);
		}

		if (this.sourceX < newSourceX)
		{
			this.shiftRight();
			this.game.hero.x -= 11.1;
			this.game.hero.x = Math.ceil(this.game.hero.x);
		}

		// Issue here is exact checking rather than inequality
		if (this.sourceX === newSourceX && this.sourceY === newSourceY) this.game.transition = false;
	}

	draw()
	{
		this.checkBounds();
		this.ctx.drawImage(this.spriteSheet, this.sourceX, this.sourceY,
                       this.sourceSize, this.sourceSize, 0, 0,
                       this.ctx.canvas.width, this.ctx.canvas.height);
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

	shiftLeft()
	{
		this.sourceX -= this.SOURCE_SHIFT;
	}

	shiftRight()
	{
		this.sourceX += this.SOURCE_SHIFT;
	}

	shiftUp()
	{
		this.sourceY -= this.SOURCE_SHIFT;
	}

	shiftDown()
	{
		this.sourceY += this.SOURCE_SHIFT;
	}
}
