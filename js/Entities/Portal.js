// TODO do I extend Entity? God there's so many functions that shouldn't be part of entity
class Portal {
  //TODO: Consider increasing portal collision area of detection, because there's a slight bug atm involving missing it.
  constructor(game, x, y, width = 60, height = 60, destinationWorld,
              destinationTMX, destinationTMY, destinationX, destinationY, ) {
    this.game = game;
    this.x = x; // sx
    this.y = y; // sy
    this.width = width;
    this.height = height;
    this.destinationWorld = destinationWorld;
    this.destinationSection =
    {
      x: destinationTMX,
      y: destinationTMY
    };
    this.destinationX = destinationX;
    this.destinationY = destinationY;
  }
}
