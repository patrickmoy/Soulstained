let ImageHandler = new ImageManager();

ImageHandler.queueDownload("./res/img/openworld.png");
ImageHandler.queueDownload("./res/img/hero.png");
ImageHandler.startDownload()
  .then(() => {
    const gameCanvas = document.getElementById("gameWorld"); // Get the
    const uiCanvas = document.getElementById("uiWorld");
    const gameContext = gameCanvas.getContext("2d");
    const uiContext = uiCanvas.getContext("2d");
    const myGame = new GameEngine(gameContext, uiContext, ImageHandler.assets);

    myGame.init();
    const collisionData = new OverworldArrays();
    // TODO remove test case and move it to the openworld
    var tileTest = new TileMap(myGame, collisionData.data.section7_7);

    for (var i = 0; i < tileTest.ALIVE_ENTITIES.length; i++)
    {
      myGame.currentEntities.push(tileTest.ALIVE_ENTITIES[i]);
    }
    myGame.run();

    // Temp demo (since we haven't fully implemented TileMap switching yet)

  });