const ImageHandler = new ImageManager();

ImageHandler.queueDownload("./res/img/openworld.png");
ImageHandler.queueDownload("./res/img/hero.png");
ImageHandler.queueDownload("./res/img/zombie.png");
ImageHandler.queueDownload("./res/img/whip.png");
ImageHandler.queueDownload("./res/img/crab.png");
ImageHandler.queueDownload("./res/img/NecroDungeon.png");
ImageHandler.queueDownload("./res/img/shinyHeart.png");
ImageHandler.queueDownload("./res/img/currency.png");
ImageHandler.queueDownload("./res/img/digits.png");
ImageHandler.queueDownload("./res/img/keyJ.png");
ImageHandler.queueDownload("./res/img/keyK.png");
ImageHandler.queueDownload("./res/img/whipPrototype.png");
ImageHandler.queueDownload("./res/img/swordPrototype.png");
ImageHandler.queueDownload("./res/img/fire.png");
ImageHandler.startDownload()
    .then(() => {
        const gameCanvas = document.getElementById("gameWorld"); // Get the
        const uiCanvas = document.getElementById("uiWorld");
        const gameContext = gameCanvas.getContext("2d");
        //const uiContext = uiCanvas.getContext("2d");
        const myGame = new GameEngine(gameContext, ImageHandler.assets);

        myGame.init();
        myGame.run();
    });
