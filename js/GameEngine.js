/** Game Engine for the {Working Title} Game
 * Copied from Seth Ladd's Game Development Talk on Google IO 2011
 * Modified to work with our game.
 */
import {path} from "./Main.js";
import {Hero} from "./Entities/Hero.js";
import {World} from "./Worlds/World.js";
const openWorldTileMaps =
	[[],
		[],
		[],
		[],
		[],
		[],
		[],
		[]
	];

// Requests the browser for when animation frame is ready.
window.requestAnimFrame = (function ()
{
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( /* function */ callback, /* DOMElement */ element)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

export class GameEngine
{
	/**
	 * Creates a Game Engine with two different contexts and cached images.
	 * @param gameContext {CanvasRenderingContext2D} 2d context of the gameplay
	 * @param uiContext {CanvasRenderingContext2D} 2d context of the ui
	 * @param images {Image[]} array of cached images for the game
	 */
	constructor(gameContext, uiContext, images)
	{
		this.IMAGES_LIST = images; // A list of images to be used for the game.
		this.GAME_CONTEXT = gameContext; // 2D Context of the main game section (where player movement occurs)
		this.UI_CONTEXT = uiContext; // 2D Context of the UI section (where HP and other player info is shown)

		this.INPUTS = {
			"KeyW": false, "KeyA": false, "KeyS": false,
			"KeyD": false, "KeyJ": false, "KeyK": false,
			"Space": false, "Enter": false
		};
		this.transition = false; // When transitioning is happening
		this.inInventory = false; // When player is in his inventory
		this.pause = false; // Pauses other actions while we switch to a new map.
		this.WORLDS = {}; // I wonder, will it create a new instance everytime you switch?
		this.currentEntities = []; // Stores entities at the current tile map

		this.TIMER; // The Game Timer to keep track of virtual time
		this.GAME_CANVAS_WIDTH; // The main canvas width
		this.GAME_CANVAS_HEIGHT; // The main canvas height
		this.UI_CANVAS_WIDTH; // The UI canvas width
		this.UI_CANVAS_HEIGHT; // The UI canvas height
		this.currentWorld; // Current world the player is in (e.g. Necromancer Dungeon or Open World)
	}

	/**
	 * Initializes the necessary starting objects to run the game.
	 */
	init()
	{
		this.GAME_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother
		this.UI_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother

		this.currentEntities.push(new Hero(this, this.IMAGES_LIST[path("hero")])); // Add hero to the entity list. Hero is always at index 0

		// Create the tilemaps

		// Create the worlds
		this.WORLDS["OpenWorld"] = new World(this, this.IMAGES_LIST[path("openworld")], openWorldTileMaps, 5, 5);

		this.currentWorld = this.WORLDS["OpenWorld"]; 	// Set the current world to the open worlds
		this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width; //
		this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;
		this.UI_CANVAS_WIDTH = this.UI_CONTEXT.canvas.width;
		this.UI_CANVAS_HEIGHT = this.UI_CONTEXT.canvas.height;
		this.TIMER = new GameTimer();
		// If button is pressed and the button is a key we care about, set it to true.
		this.GAME_CONTEXT.canvas.addEventListener("keydown", (key) =>
		{
			if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = true;
		});
		// If button is lifted from press and the button is a key we care about, set it to false.
		this.GAME_CONTEXT.canvas.addEventListener("keyup", (key) =>
		{
			if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = false; // ! Interesting, when switching to modules, you no longer need self. You can just use this. Why? !
		});

		console.log('Game initialized');
	}

	/**
	 * Officially start the game engine and the player is able to play
	 */
	run()
	{
		var self = this;

		console.log("Game is starting...");

		function gameLoop()
		{
			self.loop();
			window.requestAnimFrame(gameLoop, self.GAME_CONTEXT.canvas);
		}

		gameLoop();
	}

	// Game loop to keep the game running by updating and drawing the game instance.
	loop()
	{
		this.clockTick = this.TIMER.tick();
		this.update();
		this.draw();
	}

	/**
	 * Updates the game instance. (Updates anything related to the game like entities or collision)
	 */
	update()
	{
		if (this.inInventory) // Player is in inventory so perform inventory actions.
		{

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
		this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
		this.GAME_CONTEXT.save(); // Saves any properties of the canvas
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
			/* Call the function to redraw the UI */ // Redraw the UI
			this.UI_CONTEXT.restore();
		}
	}
}

class GameTimer
{
	/**
	 * A virtual timer to update the game properly with relation to the instance rather than real time.
	 */
	constructor()
	{
		this.gameTime = 0; // Keep track of the game time
		this.maxStep = 0.05;
		this.lastTimeStamp = 0;
	}

	/**
	 *
	 * @returns {number}
	 */
	tick()
	{
		var currentTime = Date.now();
		var delta = (currentTime - this.lastTimeStamp) / 1000;
		var gameDelta = Math.min(delta, this.maxStep);

		this.lastTimeStamp = currentTime;
		this.gameTime += gameDelta;

		return gameDelta;
	}
}
