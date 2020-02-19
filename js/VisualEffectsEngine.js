class VisualEffectsEngine {
    constructor(game) {
        this.game = game;
        this.context = this.game.GAME_CONTEXT;
        this.hitSpriteSheet = new Animation(this.game.IMAGES_LIST["./res/img/hit.png"], this, 30, 30, .5, 2);
    }

    drawHits() {
        for (var i=0; i<this.game.HitQueue.length; i++) {
            var enemy = this.game.HitQueue[i];
            var enemyX = enemy.hitbox.xMin;
            var enemyY = enemy.hitbox.yMin;
            this.hit.drawFrame(this.game.clockTick, this.context, enemyX, enemyY, "walking");
        }
        this.game.HitQueue = [];
    }

    test() {
        console.log("test");
    }

}