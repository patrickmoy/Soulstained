/** Game Engine for the {Working Title} Game
  * Copied from Seth Ladd's Game Development Talk on Google IO 2011
  * Modified to work with our game.
  */

  window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (/* function */ callback, /* DOMElement */ element) {
                  window.setTimeout(callback, 1000 / 60);
              };
  })();

class GameEngine
{
  constructor(ctx)
  {
    this.inputs = [];
    this._context = ctx;
    this.createInputs("Space");
    this.startInput();
  }

  update()
  {
    // Do something
  }

  loop()
  {

  }

  run()
  {
    var self = this;
    console.log("Game is starting...");
    function gameLoop()
    {
      self.loop();
      // Random note: interesting, when I did gameLoop(), it would cause a stack error
      // However, when I just use gameLoop, it fixed it.
      //I guess it's because you're literally calling function and causing an infinite loop?
      requestAnimFrame(gameLoop, self._context.canvas);
    }
    gameLoop();
  }

  startInput()
  {
    var self = this;
    this._context.canvas.addEventListener("keydown", (key) =>
    {
      if(self.inputs.hasOwnProperty(key.code))
      {
        console.log(key.code + " was hit!");
        self.inputs[key.code] = true;
      }
    });
  }

  // Not sure if we should even keep this or change it.
  createInput(keyCode)
  {
    this.inputs[keyCode] = false;
  }
}
