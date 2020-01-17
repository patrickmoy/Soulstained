let testManager = new ImageManager();

testManager.queueDownload("./res/img/testImage.png");
testManager.queueDownload("./res/img/testLargeImage.jpg");
testManager.queueDownload("./res/img/testLargeImage2.jpg");
testManager.queueDownload("./res/img/bridge.png");
testManager.queueDownload("./res/img/simon.png");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);



  ctx.drawImage(testManager._assetCache["./res/img/simon.png"], 0, 0);

  gameEng.init();
  gameEng.run();
  gameEng.addEntity(new Background(gameEng, testManager.getImage("./res/img/bridge.png")));
  gameEng.addEntity(new Hunter(gameEng, testManager.getImage("./res/img/simon.png")));
});
