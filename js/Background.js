class Background {
  constructor(game, backgroundImage) {
    this.x = 0;
    this.y = 0;
    this.spriteSheet = backgroundImage;
    this.game = game;
    this.ctx = this.game.ctx;
  }

  draw() {
    this.ctx.drawImage(this.spriteSheet, 0, 0, 500, 224, this.x, this.y + 76, 1000, 448);
  }

  update() {
    //Does nothing because the background does not change.
  }

}
