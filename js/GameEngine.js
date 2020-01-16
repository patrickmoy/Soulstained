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
    console.log(keyCode);
    this._inputs[keyCode] = false;
  }

  getInput(keyCode)
  {
    return this._inputs[keyCode];
  }
}
