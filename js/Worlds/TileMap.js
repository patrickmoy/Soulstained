// A single section of the screen that holds entities
// and collision arrays
class TileMap {
  /**
   *
   * @param collisionArray an array that represents the tiles that the player can not collide
   * @param entities the entities in the respective tilemap
   */
  constructor(game, collisionArray) {
    this.game = game;
    this.ALIVE_ENTITIES = []; // Stores any alive entities
    this.DEAD_ENTITIES = []; // Stores any dead entities when transitioning
    this.createTileCollision(collisionArray); // Creates the tiles for collision and passes it into entities
    // So when we're in the current tile map, the game engine is doing the update. When we transition, the current tilemap will update its alive and dead entities
    // from the game engine. This ensures the entities are dead when transitioning.
  }

  /**
   * Creates the tile entities to be stored into entities array
   * @param collisionArray the collision array to make tile entities
   * @return tileEntities an array of tile entities to be added into alive entities
   */
  createTileCollision(collisionArray) {
    // Create the tile collision here!
    for (var i = 0; i < collisionArray.length; i++) {
      var column = collisionArray[i];
      for (var j = 0; j < column.length; j++) {
        if (column[j] === 1) {
          var newEntity = new InvisibleBlock(this.game, j * 60, i * 60, 60, 60);
          // console.log("Block created at " + j + " , " + i);
          this.ALIVE_ENTITIES.push(newEntity);
        }
      }
    }
  }

  getEntities() {
    return this.ENTITIES;
  }
}