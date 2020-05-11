export class Tile {
    constructor() {
        this.monster = null;
        this.hasObstacle = false;
        this.row = 0;
        this.col = 0;
    }

    /**
     * Clone a tile or objects data
     * @param tile {{}}
     */
    clone(tile) {
        Object.keys(tile).forEach(key => {
            if(this.hasOwnProperty(key)) {
                this[key] = tile[key];
            }
        });
    }
}
