class Entity
{

  constructor(game, x, y, width, height)
  {
    this.game = game;
    this.x = x;
    this.y = y;
    this.newX = x;
    this.newY = y;
    this.width = width;
    this.height = height;
    this.isDead = false;
    this.isDying = false;
    this.collides = true;
    this.box = { // Axis Aligned Bounding Box, our collision box parameter
      min: [x, y],
      max: [x + width, y + height]
    };
  }

  getCollisionBox()
  {
    return this.box;
  }

  predictBox()
  {
    this.box.min = [this.newX, this.newY];
    this.box.max = [this.newX + this.width, this.newY + this.height];
  }

  allowUpdate()
  {
    if (!this.skipUpdate)
    {
      this.x = this.newX;
      this.y = this.newY;
    }
    else
    {
      this.newX = this.x;
      this.newY = this.y;
    }
  }

}
