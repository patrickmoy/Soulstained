class World
{

	/**
	 *
	 * @param game
	 * @param worldImage
	 * @param sectionX
	 * @param sectionY
	 */
	constructor(game, worldImage, sectionX, sectionY)
	{
		this.GAME = game;
		this.CONTEXT = game.GAME_CONTEXT;
		this.WORLD_IMAGE = worldImage;
		this.section = {
			x: sectionX,
			y: sectionY
		};

		this.SOURCE_SHIFT = 3; // Shifting amount (in px) every update();
		this.SIZE = 192; // Pixel width and height to represent one section.
		this.transition = false;
		this.sourceX = this.section.x * this.SIZE;
		this.sourceY = this.section.y * this.SIZE;
		// Update the sections position start.
	}

	update()
	{
    
	}

	draw()
	{
		this.CONTEXT.drawImage(this.WORLD_IMAGE, this.sourceX, this.sourceY, this.SIZE, this.SIZE, 0, 0,
			this.CONTEXT.canvas.width, this.CONTEXT.canvas.height);
	}

}
export class OpenWorld extends World
{
	constructor(game, worldImage, sectionX, sectionY)
	{
		super(game, worldImage, sectionX, sectionY);

		// Create open world tile maps here.
		this.openWorldTileMaps =
			[[],
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			];
	}
}
