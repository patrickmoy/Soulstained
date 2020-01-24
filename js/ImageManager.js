class ImageManager
{
  constructor()
  {
    // this._failCount = 0;
    // this._successCount = 0;
    this._assetCache = [];
    this._downloadQueue = [];
  }

  // TODO ask group if they would rather have an asset manager for both
  // sound and images in one cache like preloaded like the one he provided or something else? I found that there is some libraries that will alleviate that. We can also try something else.
  queueDownload(filePath)
  {
    console.log(filePath + ' has been added to the Download Queue.');
    this._downloadQueue.push(filePath);
  }

startDownload()
 {
     var self = this;
     function loadImages()
     {
       let promiseArray = [];
       for (let i = 0; i < self._downloadQueue.length; i++)
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

           img.src = self._downloadQueue[i];
           self._assetCache[self._downloadQueue[i]] = img;
         });
         promiseArray.push(imagePromise);
       }
       return Promise.all(promiseArray);
     }
     return loadImages();
 }

  // TODO compare performance
  // startDownload(callbackFunction)
  // {
  //     var self = this;
  //     for (let i = 0; i < self._downloadQueue.length; i++)
  //     {
  //       let img = new Image();
  //       img.addEventListener("load", () =>
  //       {
  //         console.log("Loaded " + img.src);
  //         self._successCount++;
  //         if (self.isDone()) callbackFunction();
  //       });
  //
  //       img.addEventListener("error", () =>
  //       {
  //         console.log("Error loading " + img.src);
  //         self._failCount++;
  //         if (self.isDone()) callbackFunction();
  //       });
  //       img.src = self._downloadQueue[i];
  //       self._assetCache[self._downloadQueue[i]] = img;
  //     }
  // }
  //
  // isDone()
  // {
  //   return this._downloadQueue.length === this._failCount + this._successCount;
  // }


  getImage(filePath)
  {
    return this._assetCache[filePath];
  }
}
