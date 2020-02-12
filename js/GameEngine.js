/** Game Engine for the {Working Title} Game
 * Copied from Seth Ladd's Game Development Talk on Google IO 2011
 * Modified to work with our game.
 */

// Requests the browser for when animation frame is ready.
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

class GameEngine {
    /**
     * Creates a Game Engine with two different contexts and cached images.
     * @param gameContext {CanvasRenderingContext2D} 2d context of the gameplay
     * @param uiContext {CanvasRenderingContext2D} 2d context of the ui
     * @param images {Image[]} array of cached images for the game
     */
    constructor(gameContext, uiContext, images) {
        this.IMAGES_LIST = images; // A list of images to be used for the game.
        this.GAME_CONTEXT = gameContext; // 2D Context of the main game section (where player movement occurs)
        this.UI_CONTEXT = uiContext; // 2D Context of the UI section (where HP and other player info is shown)

        this.INPUTS = {
            "KeyW": false,
            "KeyA": false,
            "KeyS": false,
            "KeyD": false,
            "KeyJ": false,
            "KeyK": false,
            "Space": false,
            "Enter": false
        };
        this.transition = false; // When transitioning is happening
        this.inInventory = false; // When player is in his inventory
        this.pause = false; // Pauses other actions while we switch to a new map.
        this.WORLDS = {}; // I wonder, will it create a new instance everytime you switch?
        this.currentEntities = []; // Stores entities at the current tile map
        this.currentPortal;
        this.TIMER; // The Game Timer to keep track of virtual time
        this.PHYSICS; // The physics/collision detection and handling engine
        this.GAME_CANVAS_WIDTH; // The main canvas width
        this.GAME_CANVAS_HEIGHT; // The main canvas height
        this.UI_CANVAS_WIDTH; // The UI canvas width
        this.UI_CANVAS_HEIGHT; // The UI canvas height
        this.HERO; // The main player of the game
        this.currentWorld; // Current world the player is in (e.g. Necromancer Dungeon or Open World)
    }

    /**
     * Initializes the necessary starting objects to run the game.
     */
    init() {
        this.GAME_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother
        this.UI_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother

        // hero initialization
        this.HERO = new Hero(this, this.IMAGES_LIST["./res/img/hero.png"]);
        // push hero to currentEntities
        this.currentEntities.push(this.HERO); // Add hero to the entity list. Hero is always at index 0

        // Create the worlds
        this.WORLDS["OpenWorld"] = new OpenWorld(this, this.IMAGES_LIST["./res/img/OpenWorld.png"], 1, 6);
        this.WORLDS["OpenWorld"].initializeTileMaps();
        this.WORLDS["NecroDungeon"] = new NecroDungeon(this, this.IMAGES_LIST["./res/img/NecroDungeon.png"], 3, 7);
        this.WORLDS["NecroDungeon"].initializeTileMaps();
        const tileMap = this.WORLDS["OpenWorld"].getCurrentTileMap();
        this.currentEntities.push.apply(this.currentEntities, tileMap.ENTITIES);

        this.currentWorld = this.WORLDS["OpenWorld"]; // Set the current world to the open worlds
        this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width;
        this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;
        this.UI_CANVAS_WIDTH = this.UI_CONTEXT.canvas.width;
        this.UI_CANVAS_HEIGHT = this.UI_CONTEXT.canvas.height;
        this.TIMER = new GameTimer();
        this.PHYSICS = new Collision();

        // If button is pressed and the button is a key we care about, set it to true.
        this.GAME_CONTEXT.canvas.addEventListener("keydown", (key) => {
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = true;
        });
        // If button is lifted from press and the button is a key we care about, set it to false.
        this.GAME_CONTEXT.canvas.addEventListener("keyup", (key) => {
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = false; // ! Interesting, when switching to modules, you no longer need self. You can just use this. Why? !
        });

        console.log('Game initialized');
    }

    /**
     * Officially start the game engine and the player is able to play
     */
    run() {
        const self = this;

        console.log("Game is starting...");

        function gameLoop() {
            self.loop();
            window.requestAnimFrame(gameLoop, self.GAME_CONTEXT.canvas);
        }

        gameLoop();
    }

    /**
     * Game loop to keep the game running by updating and drawing the game instance.
     */
    loop() {
        this.clockTick = this.TIMER.tick();
        this.update();
        this.draw();
    }

    /**
     * Updates the game instance. (Updates anything related to the game like entities or collision)
     */
    update() {
        if (this.inInventory) // Player is in inventory so perform inventory actions.
        {

        }
        else if (this.transition) // Transition is happening
        {
            this.currentWorld.update(); // Updates the current world with the new coordinates and also redraws them in the draw()
            this.HERO.eventWalk(); // Moves the player when transitioning is happening
        }
        else if (this.pause)
        {
            this.currentWorld.fade();
            if (!this.pause)
            {
                this.transposeWorlds();
            }
        }
        else {
            // Entities are now movable around the map
            // Reset all behavior flags for all entities. Can be expanded/diversified
            this.PHYSICS.resetFlags(this.currentEntities);

            // Predicts update for all entities
            this.currentEntities.forEach(entity => entity.preUpdate());

            // Flags entities for standard "impassable" behavior (mostly terrain)
            this.PHYSICS.flagImpassable(this.PHYSICS.detectCollide(this.currentEntities));

            // Updates accordingly w/ entity handler flags
            // Essentially, pushing update for valid movements.
            this.currentEntities.forEach(entity => entity.update());
            this.checkPortal();
            this.checkTransition();
        }
    }

    /**
     * Checks if the player is currently in a spot for transition to occur
     */
    checkTransition() {
        const currentBorder = this.HERO.checkBorder();
        if (currentBorder.changeInX || currentBorder.changeInY) // Checks if there is any border change in x or y direction
        {
            this.currentWorld.section.x += currentBorder.changeInX; // Change the x coordinate for the tilemap array
            this.currentWorld.section.y += currentBorder.changeInY; // Change the y coordinate for the tilemap array

            this.currentEntities = []; // Remove all entities from the respective tilemap
            this.currentEntities.push(this.HERO); // re-add the hero

            this.currentEntities.push.apply(this.currentEntities, this.WORLDS["OpenWorld"].getCurrentTileMap().ENTITIES);

            this.transition = true; // Game Engine and other necessary components is now performing transition actions
        }
    }

    /**
     * Checks if the player is inside a portal
     */
    checkPortal() {
        if (!this.pause) {
            var portals = this.currentWorld.getCurrentTileMap().PORTALS;
            for (var i=0; i < portals.length; i++) {
                console.log("check portal");
                if ((this.HERO.hitbox.yMin > portals[i].sy) &&
                    (this.HERO.hitbox.yMax < (portals[i].sy + portals[i].height)) &&
                    (this.HERO.hitbox.xMin > portals[i].sx) &&
                    (this.HERO.hitbox.xMax < (portals[i].sx + portals[i].width))
                ) {
                    this.pause = true;
                    this.currentPortal = portals[i];
                }
            }
        }
    }

    /**
     * Switches the game engine to the new world map and sets the hero's new coordinates
     */
    transposeWorlds() {
        this.currentWorld = this.WORLDS[this.currentPortal.destination];
        this.currentWorld.section.x = this.currentPortal.section.x;
        this.currentWorld.section.y = this.currentPortal.section.y;
        this.currentWorld.sourceX = this.currentPortal.section.x * 192;
        this.currentWorld.sourceY = this.currentPortal.section.y * 192;
        this.HERO.hitbox.xMin = this.currentPortal.dx;
        this.HERO.hitbox.yMin = this.currentPortal.dy;
        this.HERO.futureHitbox.xMin = this.currentPortal.dx;
        this.HERO.futureHitbox.yMin = this.currentPortal.dy;
        this.currentEntities = [];
        this.currentEntities.push(this.HERO);
        this.currentEntities.push.apply(this.currentEntities, this.currentWorld.getCurrentTileMap().ENTITIES);
    }

    /**
     * Method checks current input keys and returns whether movement inputs are
     * active.
     * @return {Boolean} Returns true if movement keys are pressed (WASD), and false otherwise.
     */
    hasMoveInputs() {
        return (this.INPUTS['KeyW'] || this.INPUTS['KeyA'] || this.INPUTS['KeyS'] ||
            this.INPUTS['KeyD']);
    }

    /**
     *
     */
    draw() {
        if (!this.transition) {
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentEntities.forEach(entity => entity.draw());
            this.GAME_CONTEXT.restore();
        }
        else {
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentEntities[0].draw();
            this.GAME_CONTEXT.restore();
        }
        // Transition is handled here
        // There was a change that affects the UI so we update the UI
        if (this.UI_CONTEXT.change) {
            // When a change occurs, we just redraw. If nothing changes, the canvas should remain static
            this.UI_CONTEXT.clearRect(0, 0, this.UI_CANVAS_WIDTH, this.UI_CANVAS_HEIGHT);
            this.UI_CONTEXT.save();
            /* Call the function to redraw the UI */ // Redraw the UI
            this.UI_CONTEXT.restore();
        }
    }
}

class GameTimer {
    /**
     * A virtual timer to update the game properly with relation to the instance rather than real time.
     */
    constructor() {
        this.gameTime = 0; // Keep track of the game time
        this.maxStep = 0.05;
        this.lastTimeStamp = 0;
    }

    /**
     *
     * @returns {number}
     */
    tick() {
        const currentTime = Date.now();
        const delta = (currentTime - this.lastTimeStamp) / 1000;
        const gameDelta = Math.min(delta, this.maxStep);

        this.lastTimeStamp = currentTime;
        this.gameTime += gameDelta;

        return gameDelta;
    }
}
