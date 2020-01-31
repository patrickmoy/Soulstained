// A section of the map that will show the current camera.
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
