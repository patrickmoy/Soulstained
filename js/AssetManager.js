/**
 * Handles all the image queueing and caching before game starts.
 */
class AssetManager {
    /**
     * Class that handles the queueing and caching of images.
     */
    constructor() {
        this.assets = []; // Store cached images
        this.downloadQueue = []; // Store images to be cached
    }

    /**
     * Adds the file in the provided path into a download queue to cache when calling startDownload()
     * @param filePath the path of the images to be cached
     */
    queueImage(filePath) {
        console.log(filePath + ' has been added to the Download Queue.');
        this.downloadQueue.push({src: filePath, type: 'img'});
    }

    /*
    queueTextFile(filePath) {
        console.log(filePath + ' has been added to the Download Queue.');
        this.downloadQueue.push({src: filePath, type: 'txt'});
    }

    getTextFile(filePath) {
        var self = this;
        return fetch(filePath).then(response => response.text()).then(textData =>
        {
            self.assets[filePath] = textData;
        });
    }
    */

    queueJSON(filePath)
    {
        console.log(filePath + ' has been added to the Download Queue.');
        this.downloadQueue.push({src: filePath, type: 'json'});
    }

    getJSON(filePath)
    {
        var self = this;
        return fetch(filePath).then(response => response.json()).then(data =>
        {
            self.assets[filePath] = data;
        });
    }

    /**
     * Starts all the downloads in the queue synchronously
     * @returns {Promise<String[]>} a promise with resolve when all assets are downloaded or reject when one or more assets fail to download
     */
    startDownload() {
        const self = this;
        function loadAssets() {
            let promiseArray = []; // An array to keep track of promises
            for (let i = 0; i < self.downloadQueue.length; i++) {
                if (self.downloadQueue[i].type === 'img')
                {
                    let imagePromise = new Promise((resolve, reject) => {
                        let img = new Image();
                        img.addEventListener("load", () => {
                            console.log("Loaded image " + img.src);
                            resolve(img.src);
                        });

                        img.addEventListener("error", () => {
                            console.log("Error loading image " + img.src);
                            reject(img.src);
                        });

                        img.src = self.downloadQueue[i].src;
                        self.assets[self.downloadQueue[i].src] = img;
                    });
                    promiseArray.push(imagePromise);
                }
                else if (self.downloadQueue[i].type === 'json')
                {
                    let jsonPromise = self.getJSON(self.downloadQueue[i].src);
                    promiseArray.push(jsonPromise);
                }
                /*
                else if (self.downloadQueue[i].type === 'txt')
                {
                    // self.downloadQueue[i].src => file path of the text file
                    let filePromise = self.getTextFile(self.downloadQueue[i].src);
                    promiseArray.push(filePromise);
                }
                */
            }
            return Promise.all(promiseArray);
        }
        return loadAssets();
    }
}