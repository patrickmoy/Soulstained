const path = (name) => `./res/img/${name}.png`;

let testManager = new ImageManager();

testManager.queueDownload(path("openworld"));
testManager.queueDownload(path("hero"));
testManager.queueDownload("./res/img/stolen_zombie.png");
testManager.startDownload().then(() =>
{
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");
  var gameEng = new GameEngine(ctx);

  gameEng.background = new Background(gameEng, testManager.getImage(path("openworld")));
  gameEng.init(new Hero(gameEng, testManager.getImage(path("hero"))));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.addEntity(new Zombie(gameEng, testManager.getImage("./res/img/stolen_zombie.png")));
  gameEng.run();
});
