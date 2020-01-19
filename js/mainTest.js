
let testManager = new ImageManager();

testManager.queueDownload("./res/img/Soulstained_Draft_1.png");
testManager.queueDownload("./res/img/testImage.png");
testManager.queueDownload("./res/img/testBackground.png");
testManager.queueDownload("./res/img/simon.png");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);



  ctx.drawImage(testManager._assetCache["./res/img/simon.png"], 0, 0);

  gameEng.init();
  gameEng.run();
  gameEng.addEntity(new Background(gameEng, testManager.getImage("./res/img/Soulstained_Draft_1.png")));
  gameEng.addEntity(new Hunter(gameEng, testManager.getImage("./res/img/simon.png")));
});
