
let testManager = new ImageManager();

testManager.queueDownload("./res/img/Soulstained_Draft_1.png");
testManager.queueDownload("./res/img/testImage.png");
testManager.queueDownload("./res/img/testBackground.png");
testManager.queueDownload("./res/img/simon.png");
testManager.queueDownload("./res/img/hero_sprites_demo.png");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);
  ctx.imageSmoothingEnabled = false;

  gameEng.background = new Background(gameEng, testManager.getImage("./res/img/Soulstained_Draft_1.png"));
  gameEng.addEntity(new Hero(gameEng, testManager.getImage("./res/img/hero_sprites_demo.png")));
  gameEng.init();
  gameEng.run();
});
