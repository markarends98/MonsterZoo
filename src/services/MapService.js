import gridData from "../data/grid.json";
import {Map} from "../models/Map";
import {Tile} from "../models/Tile";

export class MapService {
    /**
     * Get the details of a map
     * @param mapName
     * @returns {Promise<{}>}
     */
    getMapDetails(mapName) {
        return new Promise((resolve, reject) => {
            let map = gridData.find(grid => grid.name.toLowerCase() === mapName.toLowerCase());
            if (map) {
                resolve(map);
            } else {
                reject(new Error('No map found in maps with name: ' + mapName));
            }
        });
    }

    /**
     * Get map from localstorage
     * @param mapName
     * @returns {Promise<Map>}
     */
    getMap(mapName) {
        return new Promise((resolve, reject) => {
            const map = new Map();

            const mapJson = gridData.find(grid => grid.name.toLowerCase() === mapName.toLowerCase());

            if(!mapJson.grid || !mapJson.name || !mapJson.climate || !mapJson.reference_city || !mapJson.type) {
                return reject(new Error('Provided json grid is invalid'));
            }

            const grid = mapJson.grid;
            map.name = mapJson.name;
            map.climate = mapJson.climate;
            map.city = mapJson.reference_city;
            map.grid = [];

            grid.forEach((r, rowNr) => {
                let row = r.Columns;
                row.forEach((col, colNr) => {
                    const tile = new Tile();
                    tile.row = rowNr;
                    tile.col = colNr;

                    // set obstacle tile if true
                    if (col === '1' || col === 1) {
                        tile.hasObstacle = true;
                    }
                    map.grid.push(tile);
                });
            });
            resolve(map);
        });
    }
}
