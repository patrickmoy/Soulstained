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
		this.inputs = {
			"KeyW": false,
			"KeyA": false,
			"KeyS": false,
			"KeyD": false,
			"KeyJ": false,
			"KeyK": false,
			"Space": false,
			"Enter": false
		};
		this.currentTileMap = 0;
		this.ctx = ctx;
    this.SECTION_ROW = 8;
		this.transition = false;

		this.camera;
		this.background;
    this.hero;
	}
	init(hero)
	{
    this.hero = hero;
		this.timer = new GameTimer();
		this.camera = new Camera(this, this.hero);

		this.ctx.imageSmoothingEnabled = false;
		this.canvasWidth = this.ctx.canvas.width;
		this.canvasHeight = this.ctx.canvas.height;

		console.log('Game initialized');
	}

	run()
	{
		this.startInput();
		var self = this;
		console.log("Game is starting...");

		function gameLoop()
		{
			self.loop();
			window.requestAnimFrame(gameLoop, self.ctx.canvas);
		}
		gameLoop();
	}

	loop()
	{
		this.clockTick = this.timer.tick();
		this.update();
		this.draw();
	}

	update()
	{
    console.log(this.transition);
    console.log(`(x,y) = (${this.hero.x},${this.hero.y})`);
		this.camera.update();
    if (this.transition) this.background.update(this.camera.section);
		this.entities.forEach(entity => entity.update());
	}

	draw()
	{
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.ctx.save();
    this.background.draw();
    this.hero.draw();
		this.entities.forEach(entity => entity.draw());
		this.ctx.restore();
	}

	addEntity(entity)
	{
		this.entities.push(entity);
	}

	startInput()
	{
		var self = this;

		// If button is pressed and the button is a key we care about, set it to true.
		this.ctx.canvas.addEventListener("keydown", (key) =>
		{
			if (Object.prototype.hasOwnProperty.call(self.inputs, key.code))
			{

				self.inputs[key.code] = true;
			}
		});

		// If button is lifted from press and the button is a key we care about, set it to false.
		this.ctx.canvas.addEventListener("keyup", (key) =>
		{
			if (Object.prototype.hasOwnProperty.call(self.inputs, key.code))
			{
				self.inputs[key.code] = false;
			}
		});
	}

  pauseTransition()
  {

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
