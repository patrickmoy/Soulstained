/**
 *
 */
export class ImageManager
{
	/**
	 * Class that handles the queueing and caching of images.
	 */
	constructor()
	{
		this.assets = []; // Store cached images
		this.downloadQueue = []; // Store images to be cached
	}

    /**
     * Adds the file in the provided path into a download queue to cache when calling startDownload()
     * @param filePath the path of the images to be cached
     */
	queueDownload(filePath)
	{
		console.log(filePath + ' has been added to the Download Queue.');
		this.downloadQueue.push(filePath);
	}

    /**
     * Starts all the downloads in the queue synchronously
     * @returns {Promise<image>} a promise with resolve when all images are downloaded or reject when one or more images fail to download
     */
	startDownload()
	{
		var self = this;

		function loadImages()
		{
			let promiseArray = []; // An array to keep track of promises
			for (let i = 0; i < self.downloadQueue.length; i++)
			{
				let imagePromise = new Promise((resolve, reject) =>
				{
					let img = new Image();
					img.addEventListener("load", () =>
					{
						console.log("Loaded image " + img.src);
						resolve(img.src);
					});

					img.addEventListener("error", () =>
					{
						console.log("Error loading image " + img.src);
						reject(img.src);
					});

					img.src = self.downloadQueue[i];
					self.assets[self.downloadQueue[i]] = img;
				});
				promiseArray.push(imagePromise);
			}
			return Promise.all(promiseArray);
		}
		return loadImages();
	}
}
