var overworldMusic = new Howl({src: ['./res/sound/sh_sadwonder.mp3'], loop: true, volume: 0.25});
var necroMusic = new Howl({src: ['./res/sound/castle_excitement.mp3'], loop: true, volume: 0.25});
var deathMusic = new Howl({src: ['./res/sound/sh_spooky.mp3']});

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
     * @param assets {Image[]} array of cached images for the game
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
            "Enter": false,
            "click": false,
            "coord": {}
        };
        this.gateTriggers = [];
        this.transition = false; // When transitioning is happening
        this.inInventory = false; // When player is in his inventory
        this.fading = false;
        this.pause = true; // Pauses other actions while we switch to a new map.
        this.WORLDS = {}; // I wonder, will it create a new instance everytime you switch?
        this.currentEntities = [[], [], [], [], [], []]; // Stores entities at the current tile map
        this.currentMusicID;

        this.currentPortal;
        this.TIMER; // The Game Timer to keep track of virtual time
        this.DIAGONAL_ADJUSTMENT = 0.75;
        this.GAME_CANVAS_WIDTH; // The main canvas width
        this.GAME_CANVAS_HEIGHT; // The main canvas height
        this.HERO; // The main player of the game
        this.currentWorld; // Current world the player is in (e.g. Necromancer Dungeon or Open World)

        this.UI;

        this.displayHomeScreen = true;

        this.msg;
        this.newMsg = false;
        this.displayMessage = false;

        this.goods = [];
        this.newTransaction = false;
        this.displayTransaction = false;

        this.HitQueue = [];
        this.DeathQueue = [];
        this.deadEntities = [];

        this.displayContinueScreen = false;
    }

    /**
     * Initializes the necessary starting objects to run the game.
     */
    init() {
        this.GAME_CONTEXT.imageSmoothingEnabled = false; // Disable Anti-aliasing to make pixel art look smoother

        // hero initialization
        this.HERO = new Hero(this, this.ASSETS_LIST["./res/img/hero_extra.png"], this.ASSETS_LIST["./res/img/whip.png"], this.ASSETS_LIST["./res/img/hero_bow.png"], this.ASSETS_LIST["./res/img/hero_hadouken.png"]);
        // push hero to currentEntities
        this.currentEntities[0][0] = this.HERO; // Add hero to the entity list. Hero is always in an array that is at index 0 and in that array at index 0.
        this.currentEntities[0][1] = this.HERO.whip; // Add whip to the entity list. Weapons occupy Hero array in order acquired.

        // Create the worlds
        this.WORLDS["openworld"] = new OpenWorld(this, this.ASSETS_LIST["./res/img/worlds/openworld.png"], this.ASSETS_LIST["./res/img/worlds/openworld2.png"], 2, 4);
        this.WORLDS["cavebasic"] = new CaveBasic(this, this.ASSETS_LIST["./res/img/worlds/cavebasic.png"], this.ASSETS_LIST["./res/img/worlds/cavebasic2.png"], 0, 0);
        this.WORLDS["bluehouse"] = new BlueHouse(this, this.ASSETS_LIST["./res/img/worlds/bluehouse.png"], this.ASSETS_LIST["./res/img/worlds/bluehouse2.png"], 0, 0);
        this.WORLDS["necro"] = new NecroDungeon(this, this.ASSETS_LIST["./res/img/worlds/necro.png"], this.ASSETS_LIST["./res/img/worlds/necro2.png"], 4, 2);
        //this.WORLDS["necro"] = new NecroDungeon(this, this.ASSETS_LIST["./res/img/worlds/necro.png"], this.ASSETS_LIST["./res/img/worlds/necro2.png"], 0, 2);

        this.WORLDS["wolf"] = new WolfDungeon(this, this.ASSETS_LIST["./res/img/worlds/wolf.png"], this.ASSETS_LIST["./res/img/worlds/wolf2.png"], 0, 0);
        this.WORLDS["test"] = new TestDungeon(this, this.ASSETS_LIST["./res/img/worlds/testroom.png"], this.ASSETS_LIST["./res/img/worlds/testroom2.png"], 0, 0);


        this.currentWorld = this.WORLDS["openworld"]; // Set the current world to the open worlds
       // this.currentWorld = this.WORLDS["necro"]; // Set the current world to the open worlds
        // this.currentWorld = this.WORLDS["necro"];
        this.currentMusicID = overworldMusic.play();
        this.changeEntitiesToCurrent();
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
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, key.code)) this.INPUTS[key.code] = false;
        });

        this.GAME_CONTEXT.canvas.addEventListener('mousedown', (e) => {
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, "click")) this.INPUTS["click"]= true;
            if (Object.prototype.hasOwnProperty.call(this.INPUTS, "coord")) this.INPUTS["coord"] = this.getCursorPosition(this.GAME_CONTEXT.canvas, e);
        });
        console.log('Game initialized');
    }

    reset() {
        this.transition = false; // When transitioning is happening
        this.inInventory = false; // When player is in his inventory
        this.fading = false;
        this.pause = true; // Pauses other actions while we switch to a new map.
        this.WORLDS = {}; // I wonder, will it create a new instance everytime you switch?
        this.currentEntities = [[], [], [], [], [], []]; // Stores entities at the current tile map
        this.HERO = new Hero(this, this.ASSETS_LIST["./res/img/hero_extra.png"], this.ASSETS_LIST["./res/img/whip.png"], this.ASSETS_LIST["./res/img/hero_bow.png"]);
        this.currentEntities[0][0] = this.HERO; // Add hero to the entity list. Hero is always in an array that is at index 0 and in that array at index 0.
        this.currentEntities[0][1] = this.HERO.whip; // Add whip to the entity list. Weapons occupy Hero array in order acquired.
        this.WORLDS["openworld"] = new OpenWorld(this, this.ASSETS_LIST["./res/img/worlds/openworld.png"], this.ASSETS_LIST["./res/img/worlds/openworld2.png"], 2, 4);
        this.WORLDS["cavebasic"] = new CaveBasic(this, this.ASSETS_LIST["./res/img/worlds/cavebasic.png"], this.ASSETS_LIST["./res/img/worlds/cavebasic2.png"], 0, 0);
        this.WORLDS["bluehouse"] = new BlueHouse(this, this.ASSETS_LIST["./res/img/worlds/bluehouse.png"], this.ASSETS_LIST["./res/img/worlds/bluehouse2.png"], 0, 0);
        this.WORLDS["necro"] = new NecroDungeon(this, this.ASSETS_LIST["./res/img/worlds/necro.png"], this.ASSETS_LIST["./res/img/worlds/necro2.png"], 4, 2);
        this.WORLDS["wolf"] = new WolfDungeon(this, this.ASSETS_LIST["./res/img/worlds/wolf.png"], this.ASSETS_LIST["./res/img/worlds/wolf2.png"], 3, 1);
        this.currentWorld = this.WORLDS["openworld"]; // Set the current world to the open worlds
        overworldMusic.stop();
        necroMusic.stop();
        this.currentMusicID = overworldMusic.play();
        this.currentEntities[1] = this.currentWorld.getCurrentTileMap().BLOCKS;
        this.currentEntities[2] = this.currentWorld.getCurrentTileMap().ENEMIES;
        this.currentEntities[4] = this.currentWorld.getCurrentTileMap().PASSIVES;
        this.GAME_CANVAS_WIDTH = this.GAME_CONTEXT.canvas.width;
        this.GAME_CANVAS_HEIGHT = this.GAME_CONTEXT.canvas.height;

        this.UI.hero = this.HERO;
    }

    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // console.log("x: " + x + " y: " + y);
        var coord = {x: x, y: y};
        return coord;
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

    /*
     * Resets the current entities subarrays to the current tilemaps entities (simply moved duplicate codes to one function - Steven)
     */
    changeEntitiesToCurrent() {
        const currentMap = this.currentWorld.getCurrentTileMap();
        this.currentEntities[1] = currentMap.BLOCKS;
        this.currentEntities[2] = currentMap.ENEMIES;
        this.currentEntities[3] = currentMap.PROJECTILES;
        this.currentEntities[4] = currentMap.PASSIVES;
        this.currentEntities[5] = currentMap.DESTRUCTIBLES;
    }

    /**
     * Updates the game instance. (Updates anything related to the game like entities or collision)
     */
    update() {
        this.UI.update();
        // discard mouse coordinates
        this.INPUTS["coord"].x = 0;
        this.INPUTS["coord"].y = 0;
        // NESTING THE IF INVENTORY CLAUSE INSIDE THE IF PAUSE CLAUSE
        if (this.transition) // Transition is happening
        {
            this.currentWorld.update(); // Updates the current world with the new coordinates and also redraws them in the draw()
            this.HERO.eventWalk(); // Moves the player when transitioning is happening
            this.currentEntities[5].filter(destructible => destructible instanceof DestructibleBlock).forEach(destructible => destructible.eventWalk());
        }
        else if (this.pause) {
            if (this.displayMessage) {
                // PAUSE FOR MESSAGE
            } else if (this.inInventory) {
                // PAUSE FOR INVENTORY
            } else if (this.displayTransaction) {
                // PAUSE FOR TRANSACTION
            } else if (this.displayHomeScreen) {
                // PAUSE FOR HOME SCREEN
            } else if (this.displayContinueScreen) {
                // PAUSE FOR CONTINUE SCREEN
            }
            else
            {
                // PAUSE FOR PORTAL
                this.currentWorld.fade();
                if (!this.pause) {
                    this.transposeWorlds();
                }
            }
        } else if (this.newMsg) {
            this.UI.parseMessage(); // encodes string to numeric keys to index letter font sprite sheet
        } else if (this.newTransaction) {
            this.UI.parseTransaction();
        }else {
            // Entities are now movable around the map
            // Reset all behavior flags for all entities. Can be expanded/diversified
            resetFlags(this.currentEntities[0]);
            this.HERO.pushUpdateX = true;
            this.HERO.pushUpdateY = true;
            resetFlags(this.currentEntities[1]);
            resetFlags(this.currentEntities[2]);
            resetFlags(this.currentEntities[3]);
            resetFlags(this.currentEntities[4]);

            // Predicts update for all the necessary entities
            this.currentEntities[0].forEach(hero => hero.preUpdate());
            this.currentEntities[1].filter(block => block.alive).forEach(block => block.preUpdate());
            this.currentEntities[2].forEach(enemy => enemy.preUpdate());
            this.currentEntities[3].forEach(projectile => projectile.preUpdate());

            const heroAndMobs = [this.currentEntities[0][0]].concat(this.currentEntities[2]).filter(entity => entity.alive);

            // Hero and enemies vs. blocks
            const creatureToBlockCollisions = detectCollide(heroAndMobs, this.currentEntities[1].concat(this.currentEntities[4], this.currentEntities[5]));

            // Weapon vs enemies causes momentary flinching
            const flinchEffect = detectCollide(this.currentEntities[0].filter(entity => entity.active), this.currentEntities[2]);

            // Hero vs enemies
            const damageCollisions = detectCollide(this.currentEntities[0],
                this.currentEntities[2].concat(this.currentEntities[3], this.currentEntities[5]));

            // Hero vs pickups
            const pickups = detectCollide([this.currentEntities[0][0]], this.currentEntities[5].filter(destroy => destroy instanceof Pickup));
            // Flags entities for standard "impassable" behavior (mostly terrain)
            flagGravitate(creatureToBlockCollisions);
            flagImpassable(creatureToBlockCollisions);
            console.log(creatureToBlockCollisions);
            flagImpassable(flinchEffect);
            flagMessages(creatureToBlockCollisions);
            flagPickup(pickups);
            flagDamage(damageCollisions);
            // Updates accordingly w/ entity handler flags
            // Essentially, pushing update for valid movements.
            this.currentEntities[0].forEach(entity => entity.update()); // Updates hero
            // TODO weird bug where the smoke still appears on the enemy's death location when transitioning back into the tilemap. Requires a filter for alive.
            this.currentEntities[1].filter(block => block.alive).forEach(entity => entity.update());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.update());
            this.currentEntities[3].forEach(projectile => projectile.update());
            this.currentEntities[3] = this.currentEntities[3].filter(projectile => !projectile.projectileNotOnScreen() || this.currentEntities[3].every(projectile => projectile.alive === false));
            this.currentEntities[5].forEach(destructible => destructible.update());

            //Keeps track of dead knights for necromancer knight spawns.
            this.deadEntities = this.deadEntities.concat(this.currentEntities[2].filter(enemy => enemy instanceof Knight && enemy.alive === false));

            // Removes dead things (did this because we did it for every action in update(). Might as well just do it once.)
            this.currentEntities[0] = this.currentEntities[0].filter(hero => hero.alive);
            this.currentEntities[2] = this.currentEntities[2].filter(enemy => enemy.alive);
            this.currentEntities[3] = this.currentEntities[3].filter(projectile => projectile.alive);
            this.currentEntities[5] = this.currentEntities[5].filter(destructible => destructible.alive);

            // PORTAL AND BORDER TRANSITIONS
            this.checkPortal();
            this.checkTransition();

            // HERO DEATH, LOAD GAME STATE FROM LAST CHECKPOINT
            if (this.HERO.health === 0 && !this.pause && !this.displayContinueScreen)
            {
                this.displayContinueScreen = true;
                this.pause = true;
            }
        }
    }

    load() {
        this.HERO.direction = 1;
        this.HERO.status = "idle";
        setBoxToThis(this.HERO.nbx, this.HERO.originalHitbox);
        setBoxToThis(this.HERO.nby, this.HERO.originalHitbox);
        setBoxToThis(this.HERO.hitbox, this.HERO.originalHitbox);
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
            if (this.currentWorld.getCurrentTileMap()) {
                this.changeEntitiesToCurrent();
                this.currentEntities[2].forEach(enemy => enemy.resetPosition());
                this.currentEntities[5].filter(destructible => destructible.alive).forEach(destructible => {
                    // This is due to how changeInX and changeInY are column row order...
                    destructible.hitbox.xMin += this.GAME_CONTEXT.canvas.width * currentBorder.changeInY;
                    destructible.hitbox.yMin += this.GAME_CONTEXT.canvas.height * currentBorder.changeInX;
                });
                this.transition = true; // Game Engine and other necessary components is now performing transition action
            }
            else {
                this.currentWorld.section.x -= currentBorder.changeInX; // Change the x coordinate for the tilemap array
                this.currentWorld.section.y -= currentBorder.changeInY; // Change the y coordinate for the tilemap array
                this.HERO.pushUpdate = false;
                this.HERO.pushUpdateX = false;
                this.HERO.pushUpdateY = false;
            }
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
                    portal.y < this.HERO.hitbox.yMax) {
                    this.pause = true;
                    this.fading = true;
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
        setBoxToThis(this.HERO.nbx, this.HERO.hitbox);
        setBoxToThis(this.HERO.nby, this.HERO.hitbox);
        setBoxToThis(this.HERO.originalHitbox, this.HERO.hitbox);
        this.changeEntitiesToCurrent();
        this.currentEntities[2].forEach(enemy => enemy.reset());
        if (this.currentWorld === this.WORLDS["openworld"]) {
            overworldMusic.stop();
            necroMusic.stop();
            this.currentMusicID = overworldMusic.play();
        } else if (this.currentWorld === this.WORLDS["necro"]) {
            overworldMusic.stop();
            necroMusic.stop();
            this.currentMusicID = necroMusic.play();
        }
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
        if (!this.transition && !this.fading) {
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentWorld.getCurrentTileMap().WORLDANIMATIONS.forEach(animations => animations.draw());
            this.currentEntities[4].forEach(passive => passive.draw());
            this.currentEntities[5].forEach(destructible => destructible.draw());

            this.currentEntities[1].filter(block => block.alive).forEach(entity => entity.draw());
            this.currentEntities[2].filter(enemy => enemy.alive).forEach(enemy => enemy.draw());
            this.currentEntities[3].filter(projectile => projectile.alive).forEach(projectile => projectile.draw());
            this.currentEntities[3] = this.currentEntities[3].filter(projectile => !projectile.projectileNotOnScreen() || this.currentEntities[3].every(projectile => projectile.alive === false));

            this.currentEntities[0].filter(hero => hero.alive).forEach(entity => entity.draw()); // Draws the hero and his weapon
            this.drawHits();
            this.drawDeaths();
            this.currentWorld.drawLayer();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
        }
        else if (this.fading) {
            console.log("fading");
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.GAME_CONTEXT.restore();
        }
        else {
            // Transition is handled here
            this.GAME_CONTEXT.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT); // Clears the Canvas
            this.GAME_CONTEXT.save(); // Saves any properties of the canvas
            this.currentWorld.draw();
            this.currentEntities[5].filter(destructible => destructible instanceof DestructibleBlock).forEach(destructible => destructible.draw());
            this.currentEntities[0][0].draw();
            this.currentWorld.drawLayer();
            this.UI.draw();
            this.GAME_CONTEXT.restore();
        }
    }

    drawHits() {
        for (var i = 0; i < this.HitQueue.length; i++) {
            this.HitQueue[i].counter -= 1;
            this.HitQueue[i].spritesheet.drawFrame(this.clockTick, this.GAME_CONTEXT, this.HitQueue[i].dx, this.HitQueue[i].dy, "walking");
        }
        this.HitQueue = this.HitQueue.filter(element => element.counter > 0);
    }

    drawDeaths() {
        for (var i = 0; i < this.DeathQueue.length; i++) {
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
