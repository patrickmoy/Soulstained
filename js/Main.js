const AssetHandler = new AssetManager();
AssetHandler.queueTextFile("./res/text/test.txt");
AssetHandler.queueImage("./res/img/worlds/openworld.png");
AssetHandler.queueImage("./res/img/worlds/openworld2.png");
AssetHandler.queueImage("./res/img/worlds/cavebasic.png");
AssetHandler.queueImage("./res/img/worlds/cavebasic2.png");
AssetHandler.queueImage("./res/img/worlds/bluehouse.png");
AssetHandler.queueImage("./res/img/worlds/bluehouse2.png");
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
AssetHandler.queueImage('./res/img/crate.png');
AssetHandler.queueImage('./res/img/chest.png');
AssetHandler.queueImage("./res/img/whipPrototype.png");
AssetHandler.queueImage("./res/img/swordPrototype.png");
AssetHandler.queueImage("./res/img/fountainAnimation.png");
AssetHandler.queueImage("./res/img/worm.png");
AssetHandler.queueImage("./res/img/flower.png");
AssetHandler.queueImage("./res/img/fire.png");
AssetHandler.queueImage("./res/img/letters.png");
AssetHandler.queueImage("./res/img/death.png");
AssetHandler.queueImage('./res/img/heartAnimation.png');
AssetHandler.queueImage('./res/img/coinAnimation.png');
AssetHandler.queueJSON('./res/jsonderulo/section1_1.json');
AssetHandler.queueJSON('./res/jsonderulo/section1_2.json');
AssetHandler.queueJSON('./res/jsonderulo/section1_3.json');
AssetHandler.queueJSON('./res/jsonderulo/section1_4.json');
AssetHandler.queueJSON('./res/jsonderulo/section1_5.json');
AssetHandler.queueJSON('./res/jsonderulo/section2_1.json');
AssetHandler.queueJSON('./res/jsonderulo/section2_2.json');
AssetHandler.queueJSON('./res/jsonderulo/section2_3.json');
AssetHandler.queueJSON('./res/jsonderulo/section2_4.json');
AssetHandler.queueJSON('./res/jsonderulo/section2_5.json');
AssetHandler.queueJSON('./res/jsonderulo/section3_1.json');
AssetHandler.queueJSON('./res/jsonderulo/section3_2.json');
AssetHandler.queueJSON('./res/jsonderulo/section3_3.json');
AssetHandler.queueJSON('./res/jsonderulo/section3_4.json');
AssetHandler.queueJSON('./res/jsonderulo/section3_5.json');
AssetHandler.queueJSON('./res/jsonderulo/cave_section1_1.json');
AssetHandler.queueJSON('./res/jsonderulo/bluehouse_section1_1.json');
AssetHandler.startDownload()
    .then(() => {
        // var sound = new Howl({
        //     src: ['./res/sound/war.mp3'],
        //     loop: true
        // });
        // sound.play();
            const gameCanvas = document.getElementById("gameWorld"); // Get the
            const gameContext = gameCanvas.getContext("2d");
            const myGame = new GameEngine(gameContext, AssetHandler.assets);

            myGame.init();
            myGame.run();
    });
