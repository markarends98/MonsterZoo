import {WeatherApi} from "../api/WeatherApi";
import {MapService} from "../services/MapService.js";
import {MonsterConfiguratorComponent} from "../components/MonsterConfiguratorComponent";
import {MonsterService} from "../services/MonsterService";
import {MonsterStatsComponent} from "../components/MonsterStatsComponent";
import {MapComponent} from "../components/MapComponent";
import {ErrorComponent} from "../components/ErrorComponent";
import {TileComponent} from "../components/TileComponent";

export class MapController {
    static get MonsterMovedEvent() {
        return 'onMonsterMoved';
    }

    constructor() {
        this.selectedMap = 'jungle';
        this.weatherApi = new WeatherApi();
        this.mapService = new MapService();
        this.monsterService = new MonsterService();
        this.map = null;
        this.background = document.querySelector('#background');
        this.mapView = document.querySelector(MapComponent.HtmlTag);
        this.alert = document.querySelector(ErrorComponent.HtmlTag);
        this.fieldBoosts = null;
        this.addChangeMapListener();

        // Add listener for applying field boosts
        document.addEventListener(WeatherApi.weatherChangedEvent, evt => {
            let monsters = this.map.grid.filter(tile => tile.monster !== null).map(tile => tile.monster);
            this.fieldBoosts = evt.detail.fieldBoosts;
            monsters.forEach(monster => {
                monster.applyFieldBoost(this.fieldBoosts);
            });
        });

        // Add listener for saving a monster
        document.addEventListener(MonsterConfiguratorComponent.MonsterCreatedEvent, evt => {
            this.saveMonster(evt.detail, false);
        });

        // Add listener for monster updated
        document.addEventListener(MonsterConfiguratorComponent.MonsterUpdatedEvent, evt => {
            this.saveMonster(evt.detail, true);
        });

        // Add listener for monster dropped in configurator
        document.addEventListener(MonsterConfiguratorComponent.MonsterDroppedEvent, evt => {
            this.removeMonsterFromMap(evt.detail);
        });

        // Add listener for monster dropped in configurator
        document.addEventListener(MonsterConfiguratorComponent.MonsterResetDroppedEvent, evt => {
            this.addMonster(evt.detail);
        });

        // Add listener for moving monsters
        document.addEventListener(MapController.MonsterMovedEvent, evt => {
            let details = evt.detail;
            this.moveMonster(details.monster, details.oldTile, details.newTile);
        });

        // Add listener for removing monsters
        document.addEventListener(MonsterStatsComponent.RemoveMonsterEvent, evt => {
            this.removeMonster(evt.detail);
        });
    }

    /**
     * Load entire map
     */
    load() {
        this.mapService.getMap(this.selectedMap).then(map => {
            this.drawMap(map);
            this.weatherApi.getWeather(map.city);
        }).catch(error => {
            if(this.alert) {
                this.alert.showError(error);
            }
        });
    }

    /**
     * Draw map with monsters
     * @param map
     */
    drawMap(map) {
        this.monsterService.getMonsters(map.name).then(monsters => {
            monsters.forEach(monster => {
                let tile = map.grid.find(tile => tile.row === monster.row && tile.col === monster.col);
                tile.monster = monster;
            });

            this.map = map;
            this.mapView.draw(map);
        });
    }

    /**
     * Add listener for map changes
     */
    addChangeMapListener() {
        let buttons = document.querySelectorAll('.map-btn');
        buttons.forEach(btn => btn.addEventListener('click', evt => {
            if (evt.target.dataset.map === undefined) {
                return;
            }

            this.mapService.getMapDetails(evt.target.dataset.map).then(map => {
                // set selected map
                this.selectedMap = map.name;

                // disable pressed button
                buttons.forEach(b => b.disabled = false);
                evt.target.disabled = true;

                // change background
                this.background.setAttribute('class', map.type);
                this.load();
            }).catch(error => {
                if(this.alert) {
                    this.alert.showError(error);
                }
            });
        }));
    }

    /**
     * Save monster on a free tile
     * @param monster {Monster}
     * @param update {boolean}
     */
    saveMonster(monster, update) {
        let freeTile = this.map.grid.find(tile => !tile.hasObstacle && tile.monster === null);
        if (freeTile) {
            monster.bindTile(freeTile);
            let promise;
            if (update) {
                promise = this.monsterService.updateMonster(this.map.name, monster);
            } else {
                promise = this.monsterService.saveMonster(this.map.name, monster);
            }

            promise.then(savedMonster => {
                this.addMonster(savedMonster);
            }).catch(error => {
                if(this.alert) {
                    this.alert.showError(error);
                }
            });
        }
    }

    /**
     * Add monster to map
     * And let nearby monsters react
     * @param monster {Monster}
     */
    addMonster(monster) {
        let tileComponents = Array.from(document.querySelectorAll(TileComponent.HtmlTag));
        let freeTile = tileComponents.find(t => t.col === monster.col && t.row === monster.row);
        if (freeTile) {
            if (this.fieldBoosts) {
                monster.applyFieldBoost(this.fieldBoosts);
            }
            freeTile.tile.monster = monster;
            freeTile.draw();
            this.monsterReact(freeTile);
        }
    }

    /**
     *
     * @param monster {Monster}
     * @param oldTile {Tile}
     * @param newTileComponent {TileComponent}
     */
    moveMonster(monster, oldTile, newTileComponent) {
        let tileComponents = Array.from(document.querySelectorAll(TileComponent.HtmlTag));
        let oldTileComponent = tileComponents.find(tile => tile.col === oldTile.col && tile.row === oldTile.row);

        if (oldTileComponent) {
            monster.bindTile(newTileComponent.tile);
            this.monsterService.moveMonster(this.map.name, monster).then(movedMonster => {
                oldTileComponent.tile.monster = null;
                newTileComponent.tile.monster = movedMonster;

                oldTileComponent.draw();
                newTileComponent.draw();
                this.monsterReact(newTileComponent);
            }).catch(error => {
                if(this.alert) {
                    this.alert.showError(error);
                }
            });
        }
    }

    /**
     * Remove a monster from the map
     * @param monster
     */
    removeMonsterFromMap(monster) {
        let tileComponents = Array.from(document.querySelectorAll(TileComponent.HtmlTag));
        let tileComponent = tileComponents.find(tile => tile.col === monster.col && tile.row === monster.row);

        if (tileComponent) {
            tileComponent.tile.monster = null;
            tileComponent.draw();

            if (this.mapView) {
                this.mapView.removeDragStyle();
            }
        }
    }

    /**
     * Let nearby monsters react
     * @param centerTile {TileComponent}
     */
    async monsterReact(centerTile) {
        let tileComponents = Array.from(document.querySelectorAll(TileComponent.HtmlTag));
        let tiles = this.randomize([
            { col: centerTile.col, row: (centerTile.row + 1), direction: 'top' },
            { col: (centerTile.col + 1), row: centerTile.row, direction: 'right' },
            { col: centerTile.col, row: (centerTile.row - 1), direction: 'bottom' },
            { col: (centerTile.col - 1), row: centerTile.row, direction: 'left' }
        ]);

        let animations = [];

        tiles.forEach(tilePos => {
            let tile = tileComponents.find(t => t.col === tilePos.col && t.row === tilePos.row);

            if (tile.tile.monster) {
                animations.push({
                    tile: tile,
                    direction: tilePos.direction
                });
            }
        });

       if(animations.length > 0) {
           centerTile.startAnimation('center');
           await animations.reduce((prev, current) => {
               return prev.then(() => {
                  return current.tile.react(current.direction);
               });
           }, Promise.resolve());
           centerTile.animationDone('center');
       }
    }

    /**
     * Randomize an array
     * @param array {[]}
     * @returns {[]}
     */
    randomize(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Remove a monster from the map
     * @param monster {Monster}
     */
    removeMonster(monster) {
        this.monsterService.deleteMonster(this.map.name, monster).then(() => {
            this.removeMonsterFromMap(monster);
        }).catch(error => {
            if(this.alert) {
                this.alert.showError(error);
            }
        });
    }
}
