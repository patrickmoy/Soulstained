class Portal {
  constructor(game, x, y, width = 60, height = 60, destinationWorld,
              destinationTMX, destinationTMY, destinationX, destinationY, ) {
    this.game = game;
    this.x = x;
    this.y = y;
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
