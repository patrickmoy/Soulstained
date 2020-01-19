/** Game Engine for the {Working Title} Game
 * Copied from Seth Ladd's Game Development Talk on Google IO 2011
 * Modified to work with our game.
 */

window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function */ callback, /* DOMElement */ element)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

class GameEngine
{
	constructor(ctx)
	{
		this.entities = [];
		this.inputs =
    {
      "KeyW": false,
      "KeyA": false,
      "KeyS": false,
      "KeyD": false,
      "KeyJ": false,
      "KeyK": false,
      "Space": false
    };
    this.currentTileMap = 0;

		this.ctx = ctx;
		this.startInput();
	}

	init()
	{
		this.surfaceWidth = this.ctx.canvas.width;
		this.surfaceHeight = this.ctx.canvas.height;
		this.timer = new GameTimer();
		console.log('Game engine initialized');
	}

	addEntity(entity)
	{
		this.entities.push(entity);
	}

	update()
	{
		this.entities.forEach(entity => entity.update());
	}

	loop()
	{
		this.clockTick = this.timer.tick();
		this.update();
		this.draw();
	}

	draw()
	{
		this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
		this.ctx.save();
		this.entities.forEach(entity => entity.draw());
		this.ctx.restore();
	}

	run()
	{
		var self = this;
		console.log("Game is starting...");

		function gameLoop()
		{
			self.loop();
			// Random note: interesting, when I did gameLoop(), it would cause a stack error
			// However, when I just use gameLoop, it fixed it.
			//I guess it's because you're literally calling function and causing an infinite loop?
			window.requestAnimFrame(gameLoop, self.ctx.canvas);
		}
		gameLoop();
	}

	startInput()
	{
		var self = this;
		this.ctx.canvas.addEventListener("keydown", (key) =>
		{
			if (self.inputs.hasOwnProperty(key.code))
			{
				self.inputs[key.code] = true;
			}
		});

    this.ctx.canvas.addEventListener("keyup", (key) =>
  {
    if (self.inputs.hasOwnProperty(key.code))
    {
      self.inputs[key.code] = false;
    }
  });
	}
}

class GameTimer
{
	constructor()
	{
		this.gameTime = 0;
		this.maxStep = 0.05;
		this.lastTimeStamp = 0;
	}

	tick()
	{
		var currentTime = Date.now();
		var delta = (currentTime - this.lastTimeStamp) / 1000;
		this.lastTimeStamp = currentTime;
		var gameDelta = Math.min(delta, this.maxStep);
		this.gameTime += gameDelta;

		return gameDelta;

	}
}
