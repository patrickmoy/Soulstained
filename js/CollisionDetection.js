class CollisionDetection {

    constructor() {
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

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

    entitiesCollided(firstElement, secondElement) {
        const boxOne = firstElement.getCollisionBox();
        const boxTwo = secondElement.getCollisionBox();
        return boxOne.min[0] < boxTwo.max[0] &&
            boxTwo.min[0] < boxOne.max[0] &&
            boxOne.min[1] < boxTwo.max[1] &&
            boxTwo.min[1] < boxOne.max[1];
    }

    processCollisions(collisions) {
        collisions.forEach(function (element) {
            element[0].skipUpdate = true;
            element[1].skipUpdate = true;
        });
    }


}
