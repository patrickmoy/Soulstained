class Collision {
  /**
   * TODO comments
   */
  constructor() {}

  /**
   * TODO comments
   * @param entitiesToCheck
   * @returns {[]}
   */
  detectCollide(entitiesToCheck) {
    var i, j, firstElement, secondElement;
    var entityCount = entitiesToCheck.length;
    var currentCollisionPairs = [];

    // Dead entities don't need to collide
    // DECISION: DO we check if an entity necessitates checking here or elsewhere?
    for (i = 0; i < entityCount; i++) {
      firstElement = entitiesToCheck[i];

      for (j = i + 1; j < entityCount; j++) {
        secondElement = entitiesToCheck[j];

        if (this.entitiesCollided(firstElement, secondElement)) {
          currentCollisionPairs.push([firstElement, secondElement]);
        }
      }
    }
    return currentCollisionPairs;
  }
}