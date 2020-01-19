class Hunter extends Entity
{
	constructor(game, spritesheet)
	{
		super(game, 250, 310);
		this.animation = new Animation(spritesheet, 16, 32, 8, .150, 8, true, 2.0);
		this.ctx = game.ctx;
		this.speed = 150;
	}

	update()
	{
		this.x += this.game.clockTick * this.speed;
		if (this.x > this.ctx.canvas.width)
		{
			this.x = 250;
		}
	}

	draw()
	{
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}
}
