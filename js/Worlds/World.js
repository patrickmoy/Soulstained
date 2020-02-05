class World {

  /**
   *
   * @param game
   * @param worldImage
   * @param sectionX
   * @param sectionY
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
    this.sourceX = this.section.x * this.SIZE;
    this.sourceY = this.section.y * this.SIZE;
    // Update the sections position start.
  }

  update() {
    const newSourceX = this.section.x * this.SIZE;
    const newSourceY = this.section.y * this.SIZE;
    if (this.sourceX < newSourceX) this.sourceX += this.SOURCE_SHIFT; // Shift left since new X is on left
    else if (this.sourceX > newSourceX) this.sourceX -= this.SOURCE_SHIFT; // Shift right since new X is on right
    else if (this.sourceY < newSourceY) this.sourceY += this.SOURCE_SHIFT; // Shift down since new Y is on down
    else if (this.sourceY > newSourceY) this.sourceY -= this.SOURCE_SHIFT; // Shift up  since new Y is on up

    if (this.sourceX === newSourceX && this.sourceY === newSourceY) this.GAME.transition = false; // Transition is complete, turn off transitioning
  }

  draw() {
    this.CONTEXT.drawImage(this.WORLD_IMAGE, this.sourceX, this.sourceY, this.SIZE, this.SIZE, 0, 0,
        this.CONTEXT.canvas.width, this.CONTEXT.canvas.height);
  }

}
class OpenWorld extends World {
  constructor(game, worldImage, sectionX, sectionY) {
    super(game, worldImage, sectionX, sectionY);
    this.OpenWorldArrays = new OpenWorldArrays();
    this.tileMaps = [[],
                     [],
                     [],
                     [],
                     [],
                     [],
                     [],
                     []
                   ];
    // Create open world tile maps here. 8 x 8 TileMaps
    // this.openWorldTileMaps =
    // [
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()],
    // 	[new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap(), new TileMap()]
    // ];
  }
  initializeTileMaps() {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var entityArray = this.OpenWorldArrays.getEntityArray(i, j);

        var tileMap = new TileMap(this.GAME, entityArray);
        this.tileMaps[i].push(tileMap);
      }
    }
  }



  getCurrentTileMap() {
    return this.tileMaps[this.section.x][this.section.y];
  }

}

class NecroDungeon extends World {
  constructor(game, worldImage, sectionX, sectionY) {
    super(game, worldImage, sectionX, sectionY);

    // Creates tile maps for the necromancer dungeon world. # x # Tilemaps
    this.necroTileMaps = [

    ];
  }
}

class WolfDungeon extends World {
  constructor(game, worldImage, sectionX, sectionY) {
    super(game, worldImage, sectionX, sectionY);

    // Creates tile maps for the wolf dungeon world. # x # Tilemaps
    this.wolfTileMaps = [

    ];
  }
}
