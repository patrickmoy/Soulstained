class Entity {

// TODO mess with layer level
  constructor(game, x, y, layerLevel) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.Dead = false;
    this.Dying = false;
    this.moveable = true;
  }
}
