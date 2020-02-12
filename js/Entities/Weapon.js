class Weapon extends Entity {

    constructor(game, heroFutureHitbox, width, height) {
        super(game, heroFutureHitbox.xMin, heroFutureHitbox.yMin, width, height, 1);
    }
}