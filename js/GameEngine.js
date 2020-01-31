/** Game Engine for the {Working Title} Game
 * Copied from Seth Ladd's Game Development Talk on Google IO 2011
 * Modified to work with our game.
 * 12 x 12 blocks per section and 8 x 8 sections
 */
// Anything in caps is default and can not be changed.

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
	constructor(gameContext, uiContext, images)
	{
		this.IMAGES = images;
		this.GAME_CONTEXT = gameContext;
    this.UI_CONTEXT = uiContext;

    this.INPUTS = {"KeyW": false, "KeyA": false, "KeyS": false,
                   "KeyD": false, "KeyJ": false, "KeyK": false,
                   "Space": false, "Enter": false};
		this.transition = false;
    this.inInventory = false;
    this.pause = false; // Pauses other actions while we switch to a new map.
    this.WORLDS = {}; // I wonder, will it create a new instance everytime you switch?
    this.currentEntities = []; // Stores entities at the current tile map

    this.TIMER;
    this.GAME_CANVAS_WIDTH;
    this.GAME_CANVAS_HEIGHT;
    this.UI_CANVAS_WIDTH;
    this.UI_CANVAS_HEIGHT;
    this.currentWorld;
	}

	init()
	{
		this.GAME_CONTEXT.imageSmoothingEnabled = false;
    this.UI_CONTEXT.imageSmoothingEnabled = false;

    // Add hero to the entity list. Hero is always at index 0
    this.currentEntities.push(new Hero(this, this.IMAGES[path("hero")]));

    // Create the tilemaps

    // Create the worlds
    this.WORLDS["OpenWorld"] = new World(this, this.IMAGES[path("openworld")], openWorldTileMaps, 5, 5);


    // Set the current world to the open world
    this.currentWorld = this.WORLDS["OpenWorld"];
		this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width;
		this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;
    this.UI_CANVAS_WIDTH = this.UI_CONTEXT.canvas.width;
    this.UI_CANVAS_HEIGHT = this.UI_CONTEXT.canvas.height;
    this.TIMER = new GameTimer();

		console.log('Game initialized');
	}

	run()
	{
		var self = this;

    // If button is pressed and the button is a key we care about, set it to true.
    this.GAME_CONTEXT.canvas.addEventListener("keydown", (key) =>
    {
      if (Object.prototype.hasOwnProperty.call(self.INPUTS, key.code))
      {
        self.INPUTS[key.code] = true;
      }
    });
    // If button is lifted from press and the button is a key we care about, set it to false.
    this.GAME_CONTEXT.canvas.addEventListener("keyup", (key) =>
    {
      if (Object.prototype.hasOwnProperty.call(self.INPUTS, key.code))
      {
        self.INPUTS[key.code] = false;
      }
    });

		console.log("Game is starting...");

		function gameLoop()
		{
			self.loop();
			window.requestAnimFrame(gameLoop, self.GAME_CONTEXT.canvas);
		}
		gameLoop();
	}

	loop()
	{
		this.clockTick = this.TIMER.tick();
		this.update();
		this.draw();
	}

	update()
	{
    if (this.inInventory)
    {
      // Player is in the inventory which has no relation to the map. map will essentially pause
    }
    else if (this.transition)
    {
      // Transition is happening
      this.currentWorld.update();
      this.currentEntities[0].update();
    }
    else
    {
      // Player is now movable around the map
      this.currentEntities.forEach(entity => entity.update());
    }
	}

	draw()
	{
		this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT);
		this.GAME_CONTEXT.save();
    this.currentWorld.draw();
    this.currentEntities.forEach(entity => entity.draw());
    this.GAME_CONTEXT.restore();
    // Transition is handled here
    // There was a change that affects the UI so we update the UI
    if (this.UI_CONTEXT.change)
    {
      // When a change occurs, we just redraw. If nothing changes, the canvas should remain static
      this.UI_CONTEXT.clearRect(0, 0, this.UI_CANVAS_WIDTH, this.UI_CANVAS_HEIGHT);
      this.UI_CONTEXT.save();
      // Redraw the ui
      this.UI_CONTEXT.restore();
    }
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
    // Switched ordering
		var currentTime = Date.now();
		var delta = (currentTime - this.lastTimeStamp) / 1000;
    var gameDelta = Math.min(delta, this.maxStep);

		this.lastTimeStamp = currentTime;
		this.gameTime += gameDelta;

		return gameDelta;

	}
}
