import {ImageManager} from './ImageManager.js';
import {GameEngine} from "./GameEngine.js";

export const path = (name) => `./res/img/${name}.png`; // A function to help get the path of an image, provided the name of the image.

let ImageHandler = new ImageManager();

ImageHandler.queueDownload(path("openworld"));
ImageHandler.queueDownload(path("hero"));
ImageHandler.startDownload().then(() =>
{
	const gameCanvas = document.getElementById("gameWorld"); // Get the
	const uiCanvas = document.getElementById("uiWorld");
	const gameContext = gameCanvas.getContext("2d");
	const uiContext = uiCanvas.getContext("2d");
	const myGame = new GameEngine(gameContext, uiContext, ImageHandler.assets);

	myGame.init();
	myGame.run();
});
