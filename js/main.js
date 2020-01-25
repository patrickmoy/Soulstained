const path = (name) => `./res/img/${name}.png`;

let testManager = new ImageManager();

testManager.queueDownload(path("openworld"));
testManager.queueDownload(path("hero"));
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);

  gameEng.background = new Background(gameEng, testManager.getImage(path("openworld")));
  gameEng.addEntity(new Hero(gameEng, testManager.getImage(path("hero"))));
  gameEng.init();
  gameEng.run();
});
