import {ImageManager} from './ImageManager.js';
import {GameEngine} from "./GameEngine.js";

export const path = (name) => `./res/img/${name}.png`; // A function to help get the path of an image, provided the name of the image.

let ImageHandler = new ImageManager();

ImageHandler.queueDownload(path("openworld"));
ImageHandler.queueDownload(path("hero"));
ImageHandler.startDownload().then(() =>
{
	var gameCanvas = document.getElementById("gameWorld"); // Get the
	var uiCanvas = document.getElementById("uiWorld");
	var gameContext = gameCanvas.getContext("2d");
	var uiContext = uiCanvas.getContext("2d");
	var myGame = new GameEngine(gameContext, uiContext, ImageHandler.assets);

	myGame.init();
	myGame.run();
});
