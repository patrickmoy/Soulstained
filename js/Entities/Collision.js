function detectCollide(entitiesToCheck) {
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

 function entitiesCollided(firstElement, secondElement) {
     const boxOne = firstElement.futureHitbox;
     const boxTwo = secondElement.futureHitbox;
     return boxOne.xMin < boxTwo.xMax &&
         boxTwo.xMin < boxOne.xMax &&
         boxOne.yMin < boxTwo.yMax &&
         boxTwo.yMin < boxOne.yMax;
 }

function flagImpassable(collisionPairs) {
    collisionPairs.forEach(function (element) {
        // if (!(element[0] instanceof Weapon) && !(element[1] instanceof Weapon)) {
        //     element[0].pushUpdate = false;
        //     element[1].pushUpdate = false;
        // }
        // Previous code blocks everything but weapons. Switched to only invisible blocks impede.
        if (element[0] instanceof InvisibleBlock || element[1] instanceof InvisibleBlock) {
            element[0].pushUpdate = false;
            element[1].pushUpdate = false;
        }

        if (element[0] instanceof Sign || element[1] instanceof Sign) {
            element[0].pushUpdate = false;
            element[1].pushUpdate = false;
        }
    });
}

function flagDamage(collisionPairs) {
    collisionPairs.forEach(function (element) {
        if (element[0] instanceof Hero)
        {
            if (element[1] instanceof Enemy)
            {
                element[0].pushDamage = true;
            }
        }
        if (element[1] instanceof Enemy)
        {
            if (element[0] instanceof Weapon && element[0].active)
            {
                element[1].pushDamage = true;
            }
        }
    });
}

function flagMessages(collisionPairs) {
    collisionPairs.forEach(function (element) {
        if (element[0] instanceof Sign)
        {
            if (element[1] instanceof Hero)
            {
                if (element[1].direction === 0)
                {
                    element[0].pushMessage = true;
                    console.log("message!")
                }
            }
        }
        if (element[0] instanceof Hero)
        {
            if (element[1] instanceof Sign)
            {
                if (element[0].direction === 0)
                {
                    element[1].pushMessage = true;
                    console.log("message");
                }
            }
        }
    });

}


function resetFlags(entitiesToCheck) {
    for (let i = 0; i < entitiesToCheck.length; i++) {
        entitiesToCheck[i].pushUpdate = true;
    }
}