var soulstainedFormat = {
    name: "Soul Stained Format",
    extension: "json",
    write: function (map, fileName) {
        var jsonDerulo = {
            width: map.width,
            height: map.height,
            collisionSets: {},
            calcTiles: [],
            layers: [],
            realEntities: [],

        };

        var usedTiles = map.usedTilesets();

        // Calculates the calculation information
        var tileShifts = {};
        var incrementer = 0;
        var reverseShift = {};
        for (var i = 0; i < usedTiles.length; i++) {
            jsonDerulo.calcTiles[i] = {
                name: usedTiles[i].name,
                min: 1 + incrementer,
                max: incrementer + usedTiles[i].tiles.length
            };
            reverseShift[usedTiles[i].name] = 1 + incrementer;
            incrementer += usedTiles[i].tiles.length;
        }

        // Calculates the collision for the tiles.
        for (var i = 0; i < usedTiles.length; i++) {
            var currentTileset = usedTiles[i];
            var currentTilesetReal = {};
            for (var j = 0; j < currentTileset.tiles.length; j++) {
                if (currentTileset.tiles[j].objectGroup) {
                    var info = currentTileset.tiles[j].objectGroup.objects[0];
                    currentTilesetReal[currentTileset.tiles[j].id] = {
                        width: info.width,
                        height: info.height,
                        x: info.x,
                        y: info.y
                    };
                }
            }
            jsonDerulo.collisionSets[currentTileset.name] = currentTilesetReal;
        }

        // Now i see why they keep tilesheet and map separate, much more memory efficient.
        // Calculates the data information.
        for (var i = 0; i < map.layerCount; i++) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {
                var rows = [];
                for (y = 0; y < layer.height; ++y) {
                    var row = [];
                    for (x = 0; x < layer.width; ++x) {
                        var dataPoint = 0;
                        // Remove the second condition for the if statement to check for non collisions as well
                        if (layer.tileAt(x, y) !== null && layer.tileAt(x, y).objectGroup !== null) {
                            dataPoint = layer.cellAt(x, y).tileId + reverseShift[layer.tileAt(x, y).tileset.name];
                        }
                        row.push(dataPoint);
                    }
                    rows.push(row);
                }
                jsonDerulo.layers.push(rows);
            } else {
                for (var j = 0; j < layer.objectCount; j++) {
                    if (layer.objects[j].tile) {
                        jsonDerulo.realEntities.push({
                            type: layer.objects[j].tile.type,
                            originalX: layer.objects[j].x,
                            originalY: layer.objects[j].y,
                            x: layer.objects[j].x,
                            y: layer.objects[j].y - layer.objects[j].height,
                            customProperties: layer.objects[j].properties()
                        });
                    } else {
                        var jsono = {
                            type: layer.objects[j].type,
                            originalX: layer.objects[j].x,
                            originalY: layer.objects[j].y,
                            x: layer.objects[j].x,
                            y: layer.objects[j].y,
                            width: layer.objects[j].width,
                            height: layer.objects[j].height,
                            customProperties: layer.objects[j].properties()
                        };
                        if (jsono.type === "") {
                            console.log(layer.objects[j].tile.type);
                        }
                        jsonDerulo.realEntities.push(jsono);
                    }

                }
            }
        }

        var file = new TextFile(fileName, TextFile.WriteOnly);
        file.write(JSON.stringify(jsonDerulo));
        file.commit();
    }
};

tiled.registerMapFormat("soulstain", soulstainedFormat);
