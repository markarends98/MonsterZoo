import {TileComponent} from "./TileComponent";

export class MapComponent extends HTMLElement {
    static get HtmlTag() {
        return 'map-component';
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener('drop', evt => this.removeDragStyle(evt));
        this.addEventListener('dragstart', evt => this.addDragStyle(evt));
        this.addEventListener('dragend', evt => this.removeDragStyle(evt));
    }


    /**
     * Add drag style to invalid tiles
     */
    addDragStyle() {
        let elements = Array.from(document.querySelectorAll('.tile:not(.empty-tile)'));

        elements.forEach(el => {
            if(!el.classList.contains('invalid')) {
                el.classList.add('invalid')
            }
        });
    }

    /**
     * Remove drag style from invalid tiles
     */
    removeDragStyle() {
        let elements = Array.from(document.querySelectorAll('.tile:not(.empty-tile)'));

        elements.forEach(el => {
            el.classList.remove('invalid');
        });
    }

    /**
     * Draw the map
     * @param map {Map}
     */
    draw(map) {
        while (this.lastElementChild != null) {
            this.removeChild(this.lastElementChild);
        }

        // start at negative to compensate for first row being 0
        let rowCounter = -1;
        let tileRow;
        let colCount = Math.max.apply(Math, map.grid.map(function (o) {
            return o.col;
        }))
        map.grid.forEach((tile) => {
            if (rowCounter < tile.row) {
                tileRow = document.createElement('div');
                tileRow.classList.add('tile-row');
                rowCounter++;
            }

            let tileComponent = document.createElement(TileComponent.HtmlTag);
            tileComponent.tile = tile;
            tileComponent.row = tile.row;
            tileComponent.col = tile.col;
            tileRow.appendChild(tileComponent);

            if (tile.col === colCount) {
                this.appendChild(tileRow);
            }
        });
    }
}
