const path = (name) => `./res/img/${name}.png`;

let ImageHandler = new ImageManager();

ImageHandler.queueDownload(path("openworld"));
ImageHandler.queueDownload(path("hero"));
ImageHandler.startDownload().then(() =>
{
  var gameCanvas = document.getElementById("gameWorld");
  var uiCanvas = document.getElementById("uiWorld");
  var gameContext = gameCanvas.getContext("2d");
  var uiContext = uiCanvas.getContext("2d");
  var gameEng = new GameEngine(gameContext, uiContext);

  gameEng.init();
  gameEng.run();
});
