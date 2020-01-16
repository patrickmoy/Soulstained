let testManager = new ImageManager();

testManager.queueDownload("./res/img/testImage.png");
testManager.queueDownload("./res/img/testLargeImage.jpg");
testManager.queueDownload("./res/img/testLargeImage2.jpg");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);
  gameEng.run();
});
