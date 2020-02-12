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

        this.ENTITIES = []; // All entities in the respective tilemap (includes all walls, npcs, and enemies)

        this.createEntities(entityArray); // Creates the tiles for collision and passes it into entities
        // So when we're in the current tile map, the game engine is doing the update. When we transition, the current tilemap will update its alive and dead entities
        // from the game engine. This ensures the entities are dead when transitioning.
    }

    createEntities(entityArray) {

        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if (entityArray[i][j] === 1) {
                    // TODO update the invisible block with the new entity parameters - Steven Tran
                    const blockEntity = new InvisibleBlock(this.game, j * 60, i * 60, 60, 60, 0);
                    blockEntity.alive = true;
                    this.ENTITIES.push(blockEntity);
                }
                if (entityArray[i][j] === 2) {
                    const zombieEntity = new Zombie(this.game, this.game.IMAGES_LIST["./res/img/zombie.png"], j * 60, i * 60, 60, 60);
                    zombieEntity.alive = true;
                    this.ENTITIES.push(zombieEntity);
                }
            }
        }
    }
}
