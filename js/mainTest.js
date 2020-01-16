let testManager = new ImageManager();

testManager.queueDownload("./res/img/testImage.png");
testManager.queueDownload("./res/img/testLargeImage.jpg");
testManager.queueDownload("./res/img/testLargeImage2.jpg");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");

  var img = testManager.getImage("./res/img/testImage.png");

  ctx.drawImage(img, 100, 100);

  console.log('Finished drawing!');
});

// testManager.startDownload(() =>
// {
//   var canvas = document.getElementById("gameWorld");
//   var ctx = canvas.getContext("2d");
//
//   var img = testManager.getImage("./res/img/testImage.png");
//
//   ctx.drawImage(img, 100, 100);
//
//   console.log('Finished drawing!');
// });

var gameEng = new GameEngine();
gameEng.createInput("space");
