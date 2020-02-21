/*
 * A single section of the screen that holds entities
 * and collision arrays
 */
class TileMap {
    /**
     *
     * @param game the game engine
     * @param info an object containing all the information
     */
    constructor(game, info) {
        this.game = game;
        this.info = info;
        this.BLOCKS = []; // Will contain all the blocks in the entity array
        this.ENEMIES = []; // Will contain all the enemies in the entity array
        this.PORTALS = [];
        this.createEntities(); // Creates the tiles for collision and passes it into entities
    }

    // createEntities(entityArray) {
    //
    //     for (var i = 0; i < 12; i++) {
    //         for (var j = 0; j < 12; j++) {
    //             if (entityArray[i][j] === 1) {
    //                 const blockEntity = new InvisibleBlock(this.game, j * 60, i * 60, 60, 60);
    //                 blockEntity.alive = true;
    //                 this.BLOCKS.push(blockEntity);
    //             }
    //             else if (entityArray[i][j] === 2) {
    //                 const zombieEntity = new Zombie(this.game, this.game.ASSETS_LIST["./res/img/zombie.png"], j * 60, i * 60, 60, 60);
    //                 zombieEntity.alive = true;
    //                 this.ENEMIES.push(zombieEntity);
    //             }
    //             else if (entityArray[i][j] === 5) {
    //                 const crabEntity = new Crab(this.game, this.game.ASSETS_LIST['./res/img/crab.png'], j * 60, i * 60, 40, 40);
    //                 crabEntity.alive = true;
    //                 this.ENEMIES.push(crabEntity);
    //             }
    //             if (entityArray[i][j].Class === 'Portal') {
    //                 var portalEntity = new Portal(this.game, j * 60, i * 60, entityArray[i][j].Section.x,
    //                     entityArray[i][j].Section.y,
    //                     entityArray[i][j].Destination,
    //                     entityArray[i][j].dx * 60, entityArray[i][j].dy * 60);
    //                 this.PORTALS.push(portalEntity);
    //             }
    //             else if (entityArray[i][j].Class === 'FirePit') {
    //                 const firePit = new FirePit(this.game, this.game.ASSETS_LIST["./res/img/fire.png"], j*60, i*60, 60, 60);
    //                 firePit.alive = true;
    //                 this.ENEMIES.push(firePit);
    //             }
    //         }
    //     }
    // }

    createEntities()
    {
        // Creates all the collision walls
        for (var i = 0; i < this.info.layers.length; i++)
        {
            for (var j = 0; j < this.info.layers[i].length; j++)
            {
                for (var k = 0; k < this.info.layers[i][j].length; k++)
                {

                    var currentID = this.info.layers[i][j][k];

                    if (currentID !== 0)
                    {
                        for (var l = 0; l < this.info.calcTiles.length; l++)
                        {
                            var calculationTiles = this.info.calcTiles[l];
                            if (calculationTiles.min <= currentID && currentID <= calculationTiles.max)
                            {
                                var collisionInfo = this.info.collisionSets[calculationTiles.name][currentID - calculationTiles.min];
                                this.BLOCKS.push(new InvisibleBlock(this.game, k*60 + 3.75 * collisionInfo.x, j*60 + 3.75 *
                                    collisionInfo.y, collisionInfo.width * 3.75, collisionInfo.height * 3.75));
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.info.realEntities.length; i++)
        {
            var entity = this.info.realEntities[i];
            if (entity.type === 'Crab')
            {
                this.ENEMIES.push(new Crab(this.game, this.game.ASSETS_LIST['./res/img/crab.png'], entity.x * 60 / 16, entity.y * 60 / 16, 40, 40));
            }
            else if (entity.type === 'FirePit')
            {
                this.ENEMIES.push(new FirePit(this.game, this.game.ASSETS_LIST['./res/img/fire.png'], entity.x * 60 / 16, entity.y * 60 / 16, 60, 60));
            }
            else if (entity.type === 'Zombie')
            {
                this.ENEMIES.push(new Zombie(this.game, this.game.ASSETS_LIST['./res/img/zombie.png'], entity.x * 60 / 16, entity.y * 60 / 16, 60, 60));
            }
            else if (entity.type === 'Portal')
            {
                this.PORTALS.push(new Portal(this.game, entity.x * 60 / 16, entity.y * 60 / 16, entity.customProperties.width * 4,
                    entity.customProperties.height * 4, entity.customProperties.destination, entity.customProperties.TMX,
                    entity.customProperties.TMY, entity.customProperties.destinationX, entity.customProperties.destinationY));
                console.log(this.PORTALS);
            }
        }
    }
}
