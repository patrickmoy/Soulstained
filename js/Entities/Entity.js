/**
 *
 */
export class Entity
{
	/**
	 *
	 * @param game {GameEngine}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 * @param layerLevel {number}
	 */
	constructor(game, x, y, width, height, layerLevel)
	{
		this.game = game;
		this.box = {
			xMin: x,
			yMin: y,
			xMax: x + width,
			yMax: y + height
		};
		this.isDead = false;
		this.Dying = false; // ? What is this for ?
		this.moveable = true;
		// this.newBox = {
		// 	xMin: this.box.xMin + /* Some num */,
		// 	yMin: this.box.yMin + /* Some num */,
		// 	xMax: this.box.xMax + /* Some num */,
		// 	yMax: this.box.yMax + /* Some num */
		// };
	}
}
