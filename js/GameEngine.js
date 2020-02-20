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
     * @param images {Image[]} array of cached images for the game
     */
    constructor(gameContext, assets) {
        this.ASSETS_LIST = assets; // A list of images to be used for the game.
        this.GAME_CONTEXT = gameContext; // 2D Context of the main game section (where player movement occurs)
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
        this.currentEntities = [[], [], [], [], []]; // Stores entities at the current tile map

        this.GRAVITY = -15;
        this.currentPortal;
        this.TIMER; // The Game Timer to keep track of virtual time
        this.PHYSICS; // The physics/collision detection and handling engine
        this.GAME_CANVAS_WIDTH; // The main canvas width
        this.GAME_CANVAS_HEIGHT; // The main canvas height
        this.HERO; // The main player of the game
        this.currentWorld; // Current world the player is in (e.g. Necromancer Dungeon or Open World)

        this.UI;
    }

    /**
     * Initializes the necessary starting objects to run the game.
     */
    init() {
        this.GAME_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother
        //this.UI_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother

        // hero initialization
        this.HERO = new Hero(this, this.ASSETS_LIST["./res/img/hero.png"], this.ASSETS_LIST["./res/img/whip.png"]);
        // push hero to currentEntities
        this.currentEntities[0][0] = this.HERO; // Add hero to the entity list. Hero is always in an array that is at index 0 and in that array at index 0.
        this.currentEntities[0][1] = this.HERO.whip; // Add whip to the entity list. Weapons occupy Hero array in order acquired.

        // Create the worlds
        this.WORLDS["openworld"] = new OpenWorld(this, this.ASSETS_LIST["./res/img/worlds/openworld.png"], this.ASSETS_LIST["./res/img/worlds/openworld2.png"], 2, 4);
        this.WORLDS["cavebasic"] = new CaveBasic(this, this.ASSETS_LIST["./res/img/worlds/cavebasic.png"], this.ASSETS_LIST["./res/img/worlds/cavebasic2.png"], 0, 0);
        this.WORLDS["bluehouse"] = new BlueHouse(this, this.ASSETS_LIST["./res/img/worlds/bluehouse.png"], this.ASSETS_LIST["./res/img/worlds/bluehouse2.png"], 0, 0);

        this.currentWorld = this.WORLDS["openworld"]; // Set the current world to the open worlds
        this.currentEntities[1] =  this.currentWorld.getCurrentTileMap().BLOCKS;
        this.currentEntities[2] =  this.currentWorld.getCurrentTileMap().ENEMIES;
        this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width;
        this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;

        this.TIMER = new GameTimer();

        this.UI = new UserInterface(this, this.HERO, this.ASSETS_LIST);
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
        this.UI.update();
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
            resetFlags(this.currentEntities[0]);
            resetFlags(this.currentEntities[1]);
            resetFlags(this.currentEntities[2]);
            resetFlags(this.currentEntities[3]);

            // Predicts update for all the necessary entities
            this.currentEntities[0].filter(hero => hero.alive).forEach(hero => hero.preUpdate());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.preUpdate());

            const collisionPairs = detectCollide([].concat.apply([], this.currentEntities)/*.filter(entity => entity.alive)*/);

            // Flags entities for standard "impassable" behavior (mostly terrain)
            flagImpassable(collisionPairs);
            flagDamage(collisionPairs);
            // Updates accordingly w/ entity handler flags
            // Essentially, pushing update for valid movements.
            this.currentEntities[0].filter(hero => hero.alive).forEach(entity => entity.update()); // Updates hero
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.update());
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.update());
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
            this.currentEntities[1] = this.currentWorld.getCurrentTileMap().BLOCKS; // Replaces the current blocks with the ones in the new tilemap
            this.currentEntities[2] = this.currentWorld.getCurrentTileMap().ENEMIES; // Replaces the current enemies with the ones in the new tilemap
            this.currentEntities[2].forEach(enemy => enemy.resetPosition());

            this.currentEntities[3] = []; // Removes all projectiles
            this.transition = true; // Game Engine and other necessary components is now performing transition actions
        }
    }

    /**
     * Checks if the player is inside a portal
     */
    checkPortal() {
        if (!this.pause) {
            var portals = this.currentWorld.getCurrentTileMap().PORTALS;
            for (var i = 0; i < portals.length; i++) {
                var portal = portals[i];
                if (this.HERO.hitbox.xMin < portal.x + portal.width &&
                    portal.x < this.HERO.hitbox.xMax &&
                    this.HERO.hitbox.yMin < portal.y + portal.height &&
                    portal.y < this.HERO.hitbox.yMax)
                {
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
        this.currentWorld = this.WORLDS[this.currentPortal.destinationWorld];
        this.currentWorld.section.x = this.currentPortal.destinationSection.x;
        this.currentWorld.section.y = this.currentPortal.destinationSection.y;
        this.currentWorld.sourceX = this.currentWorld.section.x * 192;
        this.currentWorld.sourceY = this.currentWorld.section.y * 192;
        this.HERO.hitbox.xMin = this.currentPortal.destinationX;
        this.HERO.hitbox.yMin = this.currentPortal.destinationY;
        this.HERO.hitbox.xMax = this.HERO.hitbox.xMin + this.HERO.width;
        this.HERO.hitbox.yMax = this.HERO.hitbox.yMin + this.HERO.height;
        this.HERO.futureHitbox.xMin = this.HERO.hitbox.xMin;
        this.HERO.futureHitbox.yMin = this.HERO.hitbox.yMin;
        this.HERO.futureHitbox.xMax = this.HERO.hitbox.xMax;
        this.HERO.futureHitbox.yMax = this.HERO.hitbox.yMax;
        this.currentEntities[1] = this.currentWorld.getCurrentTileMap().BLOCKS;
        this.currentEntities[2] = this.currentWorld.getCurrentTileMap().ENEMIES;
        this.currentEntities[3] = [];
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
            this.currentEntities[0].filter(hero => hero.alive).forEach(entity => entity.draw()); // Draws the hero and his weapon.
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.draw()); // Draws the enemies
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.draw()); // Draws the projectiles
            this.currentWorld.drawLayer();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
        }
        else { // Transition is handled here
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentEntities[0][0].draw();
            this.currentWorld.drawLayer();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
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
