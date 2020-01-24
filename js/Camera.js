class Camera {
  	constructor(game, background, hero)
  	{
  		this.background = background;
  		this.game = game;
  		this.ctx = this.game.ctx;
      this.hero = hero;
      this.cornerX = 0;
      this.cornerY = 0;
      this.cameraWidth = this.ctx.canvas.width;
      this.cameraHeight = this.cameraWidth;
  	}

  	draw()
  	{
  		this.background.draw();
  	}

  	update()
  	{
      if (this.hero.x > this.cornerX + this.cameraWidth)
      {
        this.game.transition = true;
        this.background.shiftRight();
        this.hero.x = 0;
      }
      if (this.hero.y > this.cornerY + this.cameraHeight)
      {
        this.game.transition = true;
        this.background.shiftDown();
        this.hero.y = 0;
      }
      if (this.hero.x < 0) {
        this.game.transition = true;
        this.background.shiftLeft();
        this.hero.x = this.cameraWidth;
      }
      if (this.hero.y < 0) {
        this.game.transition = true;
        this.background.shiftUp();
        this.hero.y = this.cameraHeight;

      }
  	}
}
