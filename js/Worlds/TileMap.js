/*
 * A single section of the screen that holds entities
 * and collision arrays
 */
class TileMap {
    /**
     *
     * @param game the game engine
     * @param entityArray an array of all the entities in the tilemap
     */
    constructor(game, entityArray) {
        this.game = game;

        this.BLOCKS = []; // Will contain all the blocks in the entity array
        this.ENEMIES = []; // Will contain all the enemies in the entity array

        this.PORTALS = [];
        this.createEntities(entityArray); // Creates the tiles for collision and passes it into entities
        // So when we're in the current tile map, the game engine is doing the update. When we transition, the current tilemap will update its alive and dead entities
        // from the game engine. This ensures the entities are dead when transitioning.
    }

    createEntities(entityArray) {

        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if (entityArray[i][j] === 1) {
                    // TODO update the invisible block with the new entity parameters - Steven Tran
                    const blockEntity = new InvisibleBlock(this.game, j * 60, i * 60, 60, 60);
                    this.BLOCKS.push(blockEntity);
                }
                else if (entityArray[i][j] === 2) {
                    const zombieEntity = new Zombie(this.game, this.game.IMAGES_LIST["./res/img/zombie.png"], j * 60, i * 60, 60, 60);
                    this.ENEMIES.push(zombieEntity);
                }
                else if (entityArray[i][j] === 5) {
                    const crabEntity = new Crab(this.game, this.game.IMAGES_LIST['./res/img/crab.png'], j * 60, i * 60, 40, 40);
                    this.ENEMIES.push(crabEntity);
                }
                if (entityArray[i][j].Class === 'Portal') {
                    var portalEntity = new Portal(this.game, j * 60, i * 60, entityArray[i][j].Section.x,
                        entityArray[i][j].Section.y,
                        entityArray[i][j].Destination,
                        entityArray[i][j].dx * 60, entityArray[i][j].dy * 60);
                    this.PORTALS.push(portalEntity);
                }
            }
        }
    }
}
