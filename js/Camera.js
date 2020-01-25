class Camera
{
	constructor(game, hero, world)
	{
    this.game = game;
    this.hero = hero;
    this.world = world;

    // The section of the world 8x8 (x, y)
    //  [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (0, 7)]
    //  [(1, 0), (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7)]
    //  [(2, 0), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7)]
    //  [(3, 0), (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7)]
    //  [(4, 0), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7)]
    //  [(5, 0), (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7)]
    //  [(6, 0), (6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7)]
    //  [(7, 0), (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7)]

    this.cameraY = 0; // Camera's position relative to the sections of the world
    this.cameraX = 0; // Camera's position relative to the sections of the world
    this.MIN_SECTION_X = 0; // Minimum x section of the world
    this.MIN_SECTION_Y = 0; // Minimum y section of the world
    this.MAX_SECTION_X = 8 - 1; // Maximum x section of the world
    this.MAX_SECTION_Y = 8 - 1; // Maximum y section of the world

    this.newImageX = (this.cameraX * this.world.sourceSize);
    this.newImageY = (this.cameraY * this.world.sourceSize);
	}

	draw()
	{
    this.world.draw();
	}

	update()
	{
    if (!this.game.transitioning)
    {
      this.checkPlayer();
    }
    else
    {
      this.shift(this.game.transitioning);
    }
	}

  checkPlayer()
  {
    // TODO rather than comparing the hero.x or y which is just the top left corner, we need to compare to the hitbox of the player.
    // For the time being, we just test the top left corner of the player

    // Up Canvas Border
    if (this.hero.y < 0)
    {
      this.game.transitioning = 1;
      this.cameraY -= 1;
    }

    // Right Canvas Border
    if (this.hero.x > this.game.canvasWidth)
    {
      this.game.transitioning = 2;
      this.cameraX += 1;
    }

    // Down Canvas Border
    if (this.hero.y > this.game.canvasHeight)
    {
      this.game.transitioning = 3;
      this.cameraY += 1;
    }

    // Left Canvas Border
    if (this.hero.x < 0)
    {
      this.game.transitioning = 4;
      this.cameraX -= 1;
    }

    this.newImageX = (this.cameraX * this.world.sourceSize);
    this.newImageY = (this.cameraY * this.world.sourceSize);
  }

  checkBounds()
  {
    if (this.cameraX > this.MAX_SECTION_X) this.cameraX = this.MAX_SECTION_X;
    else if (this.cameraX < this.MIN_SECTION_X) this.cameraX = this.MIN_SECTION_X;
    if (this.cameraY > this.MAX_SECTION_Y) this.cameraY = this.MAX_SECTION_Y;
    else if (this.cameraY < this.MIN_SECTION_Y) this.cameraY = this.MIN_SECTION_Y;
  }

  shift(direction)
  {
    this.hero.x = 200;
    this.hero.y = 200;
    switch (direction)
    {
      case 1:
        if (this.world.sourceY > this.newImageY)
        {
            this.world.shiftUp();
            this.hero.y -= 3;
        }
        else
        {
          this.game.transitioning = 0;
        }
        break;
      case 2:
        if (this.world.sourceX < this.newImageX)
        {
            this.world.shiftRight();
            this.hero.x += 3;
        }
        else
        {
          this.game.transitioning = 0;
        }
        break;
      case 3:
        if (this.world.sourceY < this.newImageY)
        {
            this.world.shiftDown();
            this.hero.y += 3;
        }
        else
        {
          this.game.transitioning = 0;
        }
        break;
      case 4:
        if (this.world.sourceX > this.newImageX)
        {
            this.world.shiftLeft();
            this.hero.x -= 3;
        }
        else
        {
          this.game.transitioning = 0;
        }
        break;
      default:
        throw "Direction somehow chose an undefined direction";
    }
  }
}
