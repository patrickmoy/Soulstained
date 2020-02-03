// A single section of the screen that holds entities
// and collision arrays
class TileMap
{
  /**
   *
   * @param collisionArray
   * @param entities
   */
  constructor(collisionArray, entities)
  {
    this.createTileCollision(collisionArray); // Creates the tiles for collision and passes it into entities
    this.ENTITIES = entities;
  }


  createTileCollision(collisionArray)
  {
    // Create the tile collision here!
  }

  getEntities()
  {
    return this.ENTITIES;
  }
}
