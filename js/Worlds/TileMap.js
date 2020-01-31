class TileMap
{
  constructor(entities)
  {
    this.ENTITIES = entities;
  }

  update()
  {
    this.ENTITIES.forEach(entity => entity.update());
  }
}
