class Portal {
  //TODO: Consider increasing portal collision area of detection, because there's a slight bug atm involving missing it.
  constructor(game, sx, sy, sectionX, sectionY, destination, dx, dy) {
    this.game = game;
    this.sx = sx;
    this.sy = sy;
    this.width = 60;
    this.height = 60;
    this.destination = destination;
    this.section = {
      x: sectionX,
      y: sectionY
    };
    this.dx = dx;
    this.dy = dy;
  }
}
