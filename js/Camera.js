// A class that is only to keep track of the current screen position, the player position, and the transition catch.
// Is this even needed?
class Camera
{
	constructor(game, hero)
	{
    this.game = game;
    this.hero = hero;

		// The section of the world 8x8 (x, y)
    // [(0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (7,0)]
    // [(0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (6,1), (7,1)]
    // [(0,2), (1,2), (2,2), (3,2), (4,2), (5,2), (6,2), (7,2)]
    // [(0,3), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (7,3)]
    // [(0,4), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4)]
    // [(0,5), (1,5), (2,5), (3,5), (4,5), (5,5), (6,5), (7,5)]
    // [(0,6), (1,6), (2,6), (3,6), (4,6), (5,6), (6,6), (7,6)]
    // [(0,7), (1,7), (2,7), (3,7), (4,7), (5,7), (6,7), (7,7)]

	

    this.section = {x: 0, y: 0}; // Camera's position relative to the
				    // sections of the world
    this.MIN_SECTION_X = 0; // Minimum x section of the world
    this.MIN_SECTION_Y = 0; // Minimum y section of the world
    this.MAX_SECTION_X = 8 - 1; // Maximum x section of the world
    this.MAX_SECTION_Y = 8 - 1; // Maximum y section of the world
	}

	update()
	{
    this.hero.update(this.section);
    var bound = this.hero.checkBounds();
    if (!this.game.transition && bound.change)
    {
      this.game.transition = true;
      if (bound.direction === "vertical")
      {
        this.section.y += bound.change;
        this.mostRecentDirection = "vertical";
      }
      if (bound.direction === "horizontal")
      {
        this.section.x += bound.change;
        this.mostRecentDirection = "horizontal";
      }
    }
    this.checkBounds();
	}

	
  checkBounds()
  {
    if (this.section.x < this.MIN_SECTION_X) {
			this.section.x = this.MIN_SECTION_X;
		}
    if (this.section.x > this.MAX_SECTION_X) {
			this.section.x = this.MAX_SECTION_X;
		}
    if (this.section.y > this.MAX_SECTION_Y) {
			this.section.y = this.MAX_SECTION_Y;
		}
    if (this.section.y < this.MIN_SECTION_Y) {
			this.section.y = this.MIN_SECTION_Y;
		}
  }
}
