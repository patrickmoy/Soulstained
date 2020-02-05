class Enemy extends Entity {
  constructor(game, x, y, width, height)
  {
    super(game, x, y, width, height);
  }
}
class Zombie extends Enemy
{
  constructor(game, spritesheet, x, y, width, height)
  {
    super(game, x, y, width, height);
    this.animation = new Animation(spritesheet, 16, 16, 2, .450, 2, true, 3.5);
    this.context = game.GAME_CONTEXT;
    this.speed = 100;
    this.direction = 1;
    this.health = 4;
    this.pushUpdate = false;
  }


  prepdate()
  {
    
  }

  draw()
  {
    //console.log(this.x + this.y + this.width + this.height);
    this.context.beginPath();
    this.context.rect(this.x, this.y, this.width, this.height);
    this.context.stroke();
    this.animation.drawFrame(this.game.clockTick, this.context, this.hitbox.xMin, this.hitbox.yMin, 0, 'dancing');
  }

  pickDirection()
  {
    this.direction = Math.floor(Math.random() * Math.floor(5));
  }

}


class Knight extends Enemy {

}

class Skeleton extends Enemy {

}
