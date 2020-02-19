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
    constructor(gameContext, images) {
        this.IMAGES_LIST = images;
        this.GAME_CONTEXT = gameContext;
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
        this.transition = false;
        this.inInventory = false;
        this.pause = false;
        this.WORLDS = {};
        this.currentEntities = [[], [], [], [], []];

        this.GRAVITY = -15;
        this.currentPortal;
        this.TIMER;

        this.GAME_CANVAS_WIDTH;
        this.GAME_CANVAS_HEIGHT;
        this.HERO;
        this.currentWorld;

        this.UI;

        this.msg = 'YOUR SHIP WAS WRECKED IN THE STORM\nYOU WERE SAFELY WASHED ASHORE\n' +
                   'ON NECROMANCERS ISLAND CASTLE\n\n' +
                   'TWAS ONCE A BEAUTIFUL AND PEACEFUL TOWN\n' +
                   'INHABITED BY A GOOD NATURED PEOPLE\n' +
                   'NOW CORRUPTED BY SIN LIES AND DECEIT\n\n' +
                   'RAISED FROM THEIR MORTAL GRAVES\n' +
                   'ZOMBIES ROAM ABOUT THE ISLAND TERRORIZING\n' +
                   'THE REMAINING HUMAN INHABITANTS\n\n' +
                   'THERE IS NO WAY OUT\n' +
                   'DEFEAT THE NECROMANCER OR PERISH\n\n' +
                   'USE WSAD FOR MOVEMENT\n' +
                   'USE J AND K FOR ATTACKS\n\n' +
                   'BON VOYAGE                PRESS K TO EXIT';
        this.newMsg = true;
        this.displayMessage = false;

        this.HitQueue = [];
        this.DeathQueue = [];
    }


    init() {

        this.GAME_CONTEXT.imageSmoothingEnabled = false;
        this.GAME_CONTEXT.canvas.addEventListener("keydown", (key) => {
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = true;
        });
        this.GAME_CONTEXT.canvas.addEventListener("keyup", (key) => {
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = false;
        });
        this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width;
        this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;
        this.TIMER = new GameTimer();

        this.HERO = new Hero(this, this.IMAGES_LIST["./res/img/hero.png"], this.IMAGES_LIST["./res/img/whip.png"]);
        this.UI = new UserInterface(this, this.HERO, this.IMAGES_LIST);

        this.currentEntities[0][0] = this.HERO;
        this.currentEntities[0][1] = this.HERO.whip;

        this.WORLDS["OpenWorld"] = new OpenWorld(this, this.IMAGES_LIST["./res/img/openworld.png"], 7, 7);
        this.WORLDS["OpenWorld"].initializeTileMaps();
        this.WORLDS["NecroDungeon"] = new NecroDungeon(this, this.IMAGES_LIST["./res/img/NecroDungeon.png"], 3, 0);
        this.WORLDS["NecroDungeon"].initializeTileMaps();

        this.currentEntities[1] = this.WORLDS["OpenWorld"].getCurrentTileMap().BLOCKS;
        this.currentEntities[2] = this.WORLDS["OpenWorld"].getCurrentTileMap().ENEMIES;

        this.currentWorld = this.WORLDS["OpenWorld"]; // Set the current world to the open worlds
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
        if (this.transition) // Transition is happening
        {
            this.currentWorld.update(); // Updates the current world with the new coordinates and also redraws them in the draw()
            this.HERO.eventWalk(); // Moves the player when transitioning is happening
        }
        else if (this.pause)
        {
            if (this.displayMessage)
            {
                // PAUSE FOR MESSAGE
            } else if (this.inInventory)
            {
                // PAUSE FOR INVENTORY
            } else {
                // PAUSE FOR PORTAL
                this.currentWorld.fade();
                if (!this.pause) {
                    this.transposeWorlds();
                }
            }
        }
        else if (this.newMsg)
        {
            this.UI.parseMessage(); // encodes string to numeric keys to index letter font sprite sheet
        }
        else {
            // RESET ENTITIES
            resetFlags(this.currentEntities[0]);
            resetFlags(this.currentEntities[1]);
            resetFlags(this.currentEntities[2]);
            resetFlags(this.currentEntities[3]);

            // PRE-UPDATE ENTITIES
            this.currentEntities[0].filter(hero => hero.alive).forEach(hero => hero.preUpdate());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.preUpdate());
            // this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.preUpdate()); // TODO projectiles should be added from somewhere else, not the world array
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.preUpdate());

            // HANDLE COLLISIONS AND DAMAGE
            const collisionPairs = detectCollide([].concat.apply([], this.currentEntities).filter(entity => entity.alive));
            flagImpassable(collisionPairs);
            flagDamage(collisionPairs);

            // UPDATE ENTITIES
            this.currentEntities[0].filter(hero => hero.alive).forEach(entity => entity.update()); // Updates hero
            //this.currentEntities[1].filter(block => block.alive).forEach(block => block.update());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.update());
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.update());
            this.currentEntities[3] = this.currentEntities[3].filter(projectile => !projectile.projectileNotOnScreen() || this.currentEntities[3].every(projectile => projectile.alive === false));

            // PORTAL AND BORDER TRANSITIONS
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
            for (var i=0; i < portals.length; i++) {
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
            this.currentEntities[1].filter(block => block.alive).forEach(entity => entity.draw());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.draw()); // Draws the enemies
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.draw()); // Draws the projectiles
            this.drawHits();
            this.drawDeaths();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
        }
        else { // Transition is handled here
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentEntities[0][0].draw();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
        }
    }

    drawHits() {
        for (var i=0; i<this.HitQueue.length; i++)
        {
            this.HitQueue[i].counter -= 1;
            this.HitQueue[i].spritesheet.drawFrame(this.clockTick, this.GAME_CONTEXT, this.HitQueue[i].dx, this.HitQueue[i].dy, "walking");
        }
        this.HitQueue = this.HitQueue.filter(element => element.counter > 0);
    }

    drawDeaths() {
        for (var i=0; i<this.DeathQueue.length; i++)
        {
            this.DeathQueue[i].counter -= 1;
            this.DeathQueue[i].spritesheet.drawFrame(this.clockTick, this.GAME_CONTEXT, this.DeathQueue[i].dx, this.DeathQueue[i].dy, "walking");
        }
        this.DeathQueue = this.DeathQueue.filter(element => element.counter > 0);
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
