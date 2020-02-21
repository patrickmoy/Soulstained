/**
 * Returns an array of all unique pairs of colliding entities
 * @param {Array} entitiesToCheck List of entities to check for collision
 * @returns {[Entity, Entity]} a list of entity pairs that have collided
 */
function detectCollideOld(entitiesToCheck) {
    var i, j, firstElement, secondElement;
    const entityCount = entitiesToCheck.length;
    const currentCollisionPairs = [];

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

/**
 *
 * @param entities
 * @param otherEntities
 * @returns {[]}
 */
function detectCollide(entities, otherEntities) {
    // Note that controlling the order in which we pass the subarrays will make it easier to manage output.
    // i.e. If we always pass some kind of entity, then blocks - only check second element of pair for block status.
    var i, j, firstElement, secondElement;
    const entityCount = entities.length;
    const otherEntityCount = otherEntities.length;
    const currentCollisionPairs = [];

    for (i = 0; i < entityCount; i++) {
        firstElement = entities[i];

        for (j = 0; j < otherEntityCount; j++) {
            secondElement = otherEntities[j];
            if (this.entitiesCollided(firstElement, secondElement)) {
                currentCollisionPairs.push([firstElement, secondElement]);
            }
        }
    }
    return currentCollisionPairs;
}

/**
 * Returns if two elements (entities) are colliding
 * @param  {Entity} firstElement  First element to compare for collision
 * @param  {Entity} secondElement Second element to compare for collision
 * @return {Boolean} True if the two elements are colliding, false otherwise
 */
function entitiesCollided(firstElement, secondElement) {
    const boxOne = firstElement.futureHitbox;
    const boxTwo = secondElement.futureHitbox;
    return boxOne.xMin < boxTwo.xMax &&
        boxTwo.xMin < boxOne.xMax &&
        boxOne.yMin < boxTwo.yMax &&
        boxTwo.yMin < boxOne.yMax;
}

/**
 * Entities that are going to collide should not be allowed to update
 * Flags entities in collision pairs so they can't complete their update
 * @param  {Array} collisionPairs Array of pairs of collision
 * TODO: Change this to only affect block to other entity interaction
 */
function flagImpassable(collisionPairs) {
    collisionPairs.forEach(function (element) {
        // if (!(element[0] instanceof Weapon) && !(element[1] instanceof Weapon)) {
        //     element[0].pushUpdate = false;
        //     element[1].pushUpdate = false;
        // }
        // Previous code blocks everything but weapons. Switched to only invisible blocks impede.
        // if (element[0] instanceof InvisibleBlock || element[1] instanceof InvisibleBlock) {
        //     element[0].pushUpdate = false;
        //     element[1].pushUpdate = false;
        // }
        // Assuming convention of ordering of parameters (heros and enemies first, blocks/traps after)
        if (element[1] instanceof Block) { // Check if element[0] is hero or an enemy instead (non ghost).
            element[0].pushUpdate = false;
        }
        if (element[0] instanceof Weapon && element[0].active && element[1] instanceof Enemy) {
            element[1].pushUpdate = false;
        }

        if (element[0] instanceof Sign || element[1] instanceof Sign) {
            element[0].pushUpdate = false;
            element[1].pushUpdate = false;
        }

        if (element[0] instanceof Merchant || element[1] instanceof Merchant) {
            element[0].pushUpdate = false;
            element[1].pushUpdate = false;
        }
    });
}

/**
 * TODO: Maybe change so that this flags the amount of damage to take too? Based on the collision.
 * Entities that are going to collide and are part of a damage pair should flag damage.
 * @param collisionPairs
 */
function flagDamage(collisionPairs) {
    collisionPairs.forEach(function (element) {
        if (element[0] instanceof Hero && element[1] instanceof Enemy) {
            element[0].pushDamage = true;
        } else if (element[0] instanceof Weapon && element[0].active && element[1] instanceof Enemy) {
            element[1].pushDamage = true;
        }
    })
}

function flagGravitate(collisionPairs) {
    collisionPairs.forEach(function (element) {
        if (element[0] instanceof Hero && element[1] instanceof Pit) {
            element[0].gravitate(element[1].focusX, element[1].focusY, element[1].slipRate);
            console.log("SUCKING!");
            const firstElement = element[0];
            const secondElement = element[1];
            const boxOne = firstElement.futureHitbox;
            const boxTwo = secondElement.abyssHitbox;
            if (boxOne.xMin < boxTwo.xMax &&
                boxTwo.xMin < boxOne.xMax &&
                boxOne.yMin < boxTwo.yMax &&
                boxTwo.yMin < boxOne.yMax && element[0].z === 0) {
                console.log("FALLING!");
                element[0].gravitate(element[1].focusX, element[1].focusY, element[1].plungeRate);
                element[0].falling = true;
            }
        }
    })
}

function flagInteractions(collisionPairs) {
    collisionPairs.forEach(function (element) {
        if (element[0] instanceof Sign) {
            if (element[1] instanceof Hero) {
                if (element[1].direction === 0) {
                    element[0].pushMessage = true;
                    console.log("message")
                }
            }
        }
        if (element[0] instanceof Hero) {
            if (element[1] instanceof Sign) {
                if (element[0].direction === 0) {
                    element[1].pushMessage = true;
                    console.log("message");
                }
            }
        }
        if (element[0] instanceof Merchant)
        {
            if (element[1] instanceof Hero)
            {
                if (element[0].direction === 0)
                {
                    element[1].pushTransaction = true;
                    console.log("transaction");
                }
            }
        }
        if (element[0] instanceof Hero)
        {
            if (element[1] instanceof Merchant)
            {
                if (element[0].direction === 0)
                {
                    element[1].pushTransaction = true;
                    console.log("transaction");
                }
            }
        }
    });
}


/**
 * Resets flags for entities pre-loop.
 * @param {Array} entitiesToCheck
 */
function resetFlags(entitiesToCheck) {
    for (let i = 0; i < entitiesToCheck.length; i++) {
        entitiesToCheck[i].pushUpdate = true;
    }
}