
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
        this.PORTALS = []; // Will contain portals to move to other worlds
        this.PASSIVES = []; // Will contain animated blocks that can be collided
        this.COOLSTUFF = []; // Will contain animated stuff
        this.createEntities(); // Creates the tiles for collision and passes it into entities
    }

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
                this.PASSIVES.push(new FirePit(this.game, this.game.ASSETS_LIST['./res/img/fire.png'], entity.x * 60 / 16, entity.y * 60 / 16, 60, 60));
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
            }
            else if (entity.type === 'Fountain')
            {
                // TODO these random values somehow align it. Need to figure out why eventually maybe - S.T.
                this.PASSIVES.push(new Fountain(this.game, this.game.ASSETS_LIST['./res/img/fountainAnimation.png'], entity.x * 4 - 18, entity.y * 4 - 24, 48, 47))
            }
            else if (entity.type === 'worm')
            {
                this.COOLSTUFF.push(new Worm(this.game, this.game.ASSETS_LIST['./res/img/worm.png'], entity.x * 4, entity.y * 4))
            }
            else if (entity.type === 'Sign')
            {
                console.log(entity.customProperties.msg);
                this.BLOCKS.push(new Sign(this.game, entity.x * 60 / 16, entity.y * 60 / 16, 60, 60, entity.customProperties.msg));
            }
            else if (entity.type === 'merchant') {
                var items = [];
                if (entity.customProperties.item1 != undefined) {
                    var itemObject = {name: entity.customProperties.item1, price: entity.customProperties.price1, encoded: []};
                    items.push(itemObject);
                }
                if (entity.customProperties.item2 != undefined) {
                    var itemObject = {name: entity.customProperties.item2, price: entity.customProperties.price2, encoded: []}
                    items.push(itemObject);
                }
                if (entity.customProperties.item3 != undefined) {
                    var itemObject = {name: entity.customProperties.item3, price: entity.customProperties.price3, encoded: []}
                    items.push(itemObject);
                }
                if (entity.customProperties.item4 != undefined) {
                    var itemObject = {name: entity.customProperties.item4, price: entity.customProperties.price4, encoded: []}
                    items.push(itemObject);
                }
                console.log(items);
                this.BLOCKS.push(new Merchant(this.game, this.game.ASSETS_LIST['./res/img/merchant.png'], entity.x * 60 / 16, entity.y * 60 / 16, items));
            }
        }
    }
}