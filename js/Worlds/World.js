class World {

    /**
     * The world that the hero is able to move around. Examples of World are Open World, Dungeons, Houses, etc.
     * @param game the game engine
     * @param worldImage background image of the world
     * @param sectionX starting horizontal value for the section of the map
     * @param sectionY starting vertical value for the section of the map
     */
    constructor(game, worldImage, sectionX, sectionY) {
        this.GAME = game;
        this.CONTEXT = game.GAME_CONTEXT;
        this.WORLD_IMAGE = worldImage;
        this.section = {
            x: sectionX,
            y: sectionY
        };

        this.SOURCE_SHIFT = 3; // Shifting amount (in px) every update();
        this.SIZE = 192; // Pixel width and height to represent one section.
        this.sourceX = this.section.x * this.SIZE; // Used to update the sections position start.
        this.sourceY = this.section.y * this.SIZE;

    }

    /**
     * Updates the background image's section. Only changes when we're transitioning.
     */
    update() {
        const newSourceX = this.section.x * this.SIZE;
        const newSourceY = this.section.y * this.SIZE;
        if (this.sourceX < newSourceX) this.sourceX += this.SOURCE_SHIFT; // Shift left since new X is on left
        else if (this.sourceX > newSourceX) this.sourceX -= this.SOURCE_SHIFT; // Shift right since new X is on right
        else if (this.sourceY < newSourceY) this.sourceY += this.SOURCE_SHIFT; // Shift down since new Y is on down
        else if (this.sourceY > newSourceY) this.sourceY -= this.SOURCE_SHIFT; // Shift up  since new Y is on up

        if (this.sourceX === newSourceX && this.sourceY === newSourceY) this.GAME.transition = false; // Transition is complete, turn off transitioning
    }

    /**
     * Draws the current section of the world defined by section.x and section.y
     */
    draw() {
        this.CONTEXT.drawImage(this.WORLD_IMAGE, this.sourceX, this.sourceY, this.SIZE, this.SIZE, 0, 0,
            this.CONTEXT.canvas.width, this.CONTEXT.canvas.height);
    }

}

class OpenWorld extends World {
    /**
     * The main world where the player spawns and moves around in. Also a world that enters other worlds.
     * @param game the game engine
     * @param worldImage background image of the world
     * @param sectionX starting horizontal value for the section of the map
     * @param sectionY starting vertical value for the section of the map
     */
    constructor(game, worldImage, sectionX, sectionY) {
        super(game, worldImage, sectionX, sectionY);
        this.OpenWorldArrays = new OpenWorldArrays();
        // Create a foundation for open world tile maps here. 8 x 8 TileMaps
        this.tileMaps = [[],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
    }

    /**
     * Create all the TileMaps for the OpenWorld using the Open World Arrays
     */
    initializeTileMaps() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const entityArray = this.OpenWorldArrays.getEntityArray(i, j);
                const tileMap = new TileMap(this.GAME, entityArray);
                this.tileMaps[i].push(tileMap);
            }
        }
    }

    // Is this function really necessary. - Steven Tran
    /**
     * Returns the current tile map.
     *
     * @returns {TileMap} the current tilemap of the world
     */
    getCurrentTileMap() {
        return this.tileMaps[this.section.x][this.section.y];
    }

}

class NecroDungeon extends World {
    constructor(game, worldImage, sectionX, sectionY) {
        super(game, worldImage, sectionX, sectionY);

        // Creates tile maps for the necromancer dungeon world. # x # Tilemaps
        this.necroTileMaps = [];
    }
}

class WolfDungeon extends World {
    constructor(game, worldImage, sectionX, sectionY) {
        super(game, worldImage, sectionX, sectionY);

        // Creates tile maps for the wolf dungeon world. # x # Tilemaps
        this.wolfTileMaps = [];
    }
}
