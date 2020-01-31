// A single section of the screen that holds entities
// and collision arrays
class TileMap
{
  constructor(collisionArray, entities)
  {
    this.COLLISION_ARRAY = collisionArray;
    this.ENTITIES = entities;
  }

  getEntities()
  {
    return this.ENTITIES;
  }
}
