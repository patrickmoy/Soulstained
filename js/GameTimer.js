class GameTimer {
  constructor() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.lastTimeStamp = 0;
  }

  tick() {
    var currentTime = Date.now();
    var delta = (currentTime - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = currentTime;
    var gameDelta = Math.min(delta, this.maxStep);
    this.gameTime += gameDelta;

    return gameDelta;

  }

}
