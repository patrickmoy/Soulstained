/** Game Engine for the {Working Title} Game
  * Copied from Seth Ladd's Game Development Talk on Google IO 2011
  * Modified to work with our game.
  */

class GameEngine
{
  constructor()
  {
    this._inputs = [];
  }

  createInput(keyCode)
  {
    this._inputs[keyCode] = false;
  }

  get input(keyCode)
  {
    return this._inputs[keyCode];
  }
}
