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
        this.BLOCKS = []; // Will contain all the invisible blocks in the entity array
        this.ENEMIES = []; // Will contain all the enemies in the entity array
        this.PORTALS = []; // Will contain portals to move to other worlds
        this.PASSIVES = []; // Will contain blocks that can be collided or has an image to display
        this.PROJECTILES = []; // Will contain any projectiles
        this.WORLDANIMATIONS = []; // Will contain animated stuff. Does not store into any entities subarray, just called and drawn.
        this.DESTRUCTIBLES = []; // Stores any destructibles (e.g. crates)
        this.TRIGGERS = [];
        this.createEntities(); // Creates the tiles for collision and passes it into entities
    }

    createEntities() {
        // Creates all the collision walls
        for (var i = 0; i < this.info.layers.length; i++) {
            for (var j = 0; j < this.info.layers[i].length; j++) {
                for (var k = 0; k < this.info.layers[i][j].length; k++) {
                    var currentID = this.info.layers[i][j][k];
                    if (currentID !== 0) {
                        for (var l = 0; l < this.info.calcTiles.length; l++) {
                            var calculationTiles = this.info.calcTiles[l];
                            if (calculationTiles.min <= currentID && currentID <= calculationTiles.max) {
                                var collisionInfo = this.info.collisionSets[calculationTiles.name][currentID -
                                calculationTiles.min];
                                this.BLOCKS.push(
                                    new InvisibleBlock(this.game, k * 60 + 3.75 * collisionInfo.x, j * 60 + 3.75 *
                                        collisionInfo.y,
                                        collisionInfo.width * 3.75, collisionInfo.height * 3.75));
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.info.realEntities.length; i++) {
            var entity = this.info.realEntities[i];
            if (entity.type === 'Crab') {
                this.ENEMIES.push(new Crab(this.game, this.game.ASSETS_LIST['./res/img/crab.png'], entity.x * 60 / 16,
                    entity.y * 60 / 16, 40, 40));
            }
            else if (entity.type === 'FirePit') {
                this.PASSIVES.push(new Block(this.game, this.game.ASSETS_LIST['./res/img/fire.png'], entity.x * 60 / 16,
                    entity.y * 60 / 16, 60, 60, 16, 16, .1, 4, [4]));
            }
            else if (entity.type === 'Zombie') {
                this.ENEMIES.push(
                    new Zombie(this.game, this.game.ASSETS_LIST['./res/img/zombie.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60, 60));
            }
            else if (entity.type === 'Portal') {
                this.PORTALS.push(
                    new Portal(this.game, entity.x * 60 / 16, entity.y * 60 / 16, entity.customProperties.width * 4,
                        entity.customProperties.height * 4, entity.customProperties.destination,
                        entity.customProperties.TMX,
                        entity.customProperties.TMY, entity.customProperties.destinationX,
                        entity.customProperties.destinationY));
            }
            else if (entity.type === 'Fountain') {
                this.WORLDANIMATIONS.push(
                    new Block(this.game, this.game.ASSETS_LIST['./res/img/fountainAnimation.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 0, 0, 48, 47, .125, 3.756, [3]))
            }
            else if (entity.type === 'worm') {
                this.WORLDANIMATIONS.push(
                    new WorldAnimation(this.game, this.game.ASSETS_LIST['./res/img/worm.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 2.3, [3]))
            }
            else if (entity.type === 'Mage') {
                this.ENEMIES.push(new Mage(this.game, this.game.ASSETS_LIST['./res/img/mage.png'], 100, 100, 56, 56));
            }
            else if (entity.type === 'Necromancer') {
                this.ENEMIES.push(
                    new Necromancer(this.game, this.game.ASSETS_LIST['./res/img/necro.png'], 300, 100, 56, 56,
                        this.ENEMIES));
            }
            else if (entity.type === 'Beast') {
                this.ENEMIES.push(new Beast(this.game, this.game.ASSETS_LIST['./res/img/beast.png'], 600, 300, 56, 56,
                    entity.customProperties.position));
            }
            else if (entity.type === 'Flower') {
                this.WORLDANIMATIONS.push(
                    new WorldAnimation(this.game, this.game.ASSETS_LIST['./res/img/flower.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60 / 16, [4]))
            }
            else if (entity.type === 'Crate') {
                this.DESTRUCTIBLES.push(
                    new DestructibleBlock(this.game, this.game.ASSETS_LIST['./res/img/crate.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60, 60, 16, 16, 1, 4, [1]));
            }
            else if (entity.type === 'Pit') {
                this.BLOCKS.push(new Pit(this.game, entity.x * 60 / 16, entity.y * 60 / 16));
            }
            else if (entity.type === 'Archer') {
                this.ENEMIES.push(
                    new Sniper(this.game, this.game.ASSETS_LIST['./res/img/sniper.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60, 60, entity.customProperties.direction));
            }
            else if (entity.type === 'Sign') {
                this.BLOCKS.push(
                    new Sign(this.game, entity.x * 60 / 16, entity.y * 60 / 16, 60, 60, entity.customProperties.msg));
            }
            else if (entity.type === 'merchant') {
                var items = JSON.parse(entity.customProperties.items);
                this.BLOCKS.push(
                    new Merchant(this.game, this.game.ASSETS_LIST['./res/img/merchant.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60, 60, items));
            }
            else if (entity.type === 'Chest') {
                let checkAmount = 0;
                if (entity.customProperties.amount !== undefined) {
                    checkAmount = entity.customProperties.amount;
                }
                this.BLOCKS.push(
                    new Chest(this.game, this.game.ASSETS_LIST['./res/img/smallchest.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 60, 60, entity.customProperties.msg, entity.customProperties.loot,
                        checkAmount));
            }
            else if (entity.type === 'BigChest') {
                let checkAmount = 0;
                if (entity.customProperties.amount !== undefined) {
                    checkAmount = entity.customProperties.amount;
                }
                this.BLOCKS.push(
                    new BigChest(this.game, this.game.ASSETS_LIST['./res/img/bigchest.png'], entity.x * 60 / 16,
                        entity.y * 60 / 16, 120, 90, entity.customProperties.msg, entity.customProperties.loot,
                        checkAmount));
            }
            else if (entity.type === 'Lever') {
                this.BLOCKS.push(new Lever(this.game, this.game.ASSETS_LIST['./res/img/lever.png'], entity.x * 60 / 16,
                    entity.y * 60 / 16, 60, 60, entity.customProperties.trigger));
            }
            else if (entity.type === 'Gate') {
                this.BLOCKS.push(new Gate(this.game, this.game.ASSETS_LIST['./res/img/gate.png'], entity.x * 60 / 16,
                    entity.y * 60 / 16, 60, 60, entity.customProperties.trigger));
            }
            else if (entity.type === 'Lock') {
                this.BLOCKS.push(new Lock(this.game, this.game.ASSETS_LIST['./res/img/lock.png'],
                    this.game.ASSETS_LIST['./res/img/bosslock.png'], entity.x * 60 / 16, entity.y * 60 / 16, 60, 60,
                    entity.customProperties.face, entity.customProperties.strength));
            }
        }
    }
}
