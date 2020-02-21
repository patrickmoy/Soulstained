const AssetHandler = new AssetManager();
AssetHandler.queueTextFile("./res/text/test.txt");
AssetHandler.queueImage("./res/img/openworld.png");
AssetHandler.queueImage("./res/img/hero.png");
AssetHandler.queueImage("./res/img/hero_extra.png");
AssetHandler.queueImage("./res/img/hit.png");
AssetHandler.queueImage("./res/img/zombie.png");
AssetHandler.queueImage("./res/img/fireball.png");
AssetHandler.queueImage("./res/img/sniper.png");
AssetHandler.queueImage("./res/img/NecroFireball.png");
AssetHandler.queueImage("./res/img/knight.png");
AssetHandler.queueImage("./res/img/whip.png");
AssetHandler.queueImage("./res/img/crab.png");
AssetHandler.queueImage("./res/img/FIREARROW.png");
AssetHandler.queueImage("./res/img/NecroDungeon.png");
AssetHandler.queueImage("./res/img/shinyHeart.png");
AssetHandler.queueImage("./res/img/currency.png");
AssetHandler.queueImage("./res/img/digits.png");
AssetHandler.queueImage("./res/img/keyJ.png");
AssetHandler.queueImage("./res/img/keyK.png");
AssetHandler.queueImage("./res/img/whipPrototype.png");
AssetHandler.queueImage("./res/img/swordPrototype.png");
AssetHandler.queueImage("./res/img/fire.png");
AssetHandler.queueImage("./res/img/letters.png");
AssetHandler.queueImage("./res/img/death.png");
AssetHandler.startDownload()
    .then(() => {
        const gameCanvas = document.getElementById("gameWorld"); // Get the
        const gameContext = gameCanvas.getContext("2d");
        const myGame = new GameEngine(gameContext, AssetHandler.assets);

        myGame.init();
        myGame.run();
    });
