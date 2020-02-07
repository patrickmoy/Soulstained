class CollisionDetection {

    /**
     * Handles all the collision detection between every entity in the entities array
     */
    constructor() {
        this.entities = [];
    }

    /**
     * Checks the collision between all the entities in the entities array
     * @returns {[]} an array of entities that have collided. Each element is a set of 2 entities that have collided
     */
    checkCollisions() {
        var i, j, firstElement, secondElement;
        const entityCount = this.entities.length;
        const collisions = [];

        // Dead entities don't need to collide
        for (i = 0; i < entityCount; i++) { // Change to check if entity is dead
            firstElement = this.entities[i];

            for (j = i + 1; j < entityCount; j++) {
                secondElement = this.entities[j];

                if (this.entitiesCollided(firstElement, secondElement)) {
                    collisions.push([firstElement, secondElement]);
                }
            }
        }
        return collisions;
    }

    /**
     * Checks two entities against each other to see if they collide
     * @param firstElement the first element to check collision
     * @param secondElement the second element to check collision
     * @returns {boolean|boolean} true if two entities have collided; false otherwise
     */
    entitiesCollided(firstElement, secondElement) {
        const boxOne = firstElement.getCollisionBox();
        const boxTwo = secondElement.getCollisionBox();
        return boxOne.min[0] < boxTwo.max[0] &&
            boxTwo.min[0] < boxOne.max[0] &&
            boxOne.min[1] < boxTwo.max[1] &&
            boxTwo.min[1] < boxOne.max[1];
    }

    /**
     * Updates all the collided entities to not update their position
     * @param collisions an array of the collided entities
     */
    processCollisions(collisions) {
        collisions.forEach(function (element) {
            element[0].skipUpdate = true;
            element[1].skipUpdate = true;
        });
    }


}
