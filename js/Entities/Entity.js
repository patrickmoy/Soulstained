class Entity {

// TODO mess with layer level
  constructor(game, x, y, width, height, layerLevel) {
    this.game = game;
    this.box = {
      xMin: x,
      yMin: y,
      xMax: x + width,
      yMax: y + height
    };
    this.Dead = false;
    this.Dying = false;
    this.moveable = true;
    this.newBox = {
      xMin: this.box.xMin + /* Some num */,
      yMin: this.box.yMin + /* Some num */,
      xMax: this.box.xMax + /* Some num */,
      yMax: this.box.yMax + /* Some num */
    }
  }
}
