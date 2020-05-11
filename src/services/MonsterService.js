import {Monster} from "../models/Monster";

export class MonsterService {
    constructor() {
        this.uuid = require('uuid');
    }

    /**
     * Get monsters for a specific map
     * @param mapName {string}
     * @returns {Promise}
     */
    getMonsters(mapName) {
        return new Promise((resolve, reject) => {
            let monsterStorage = JSON.parse(localStorage.getItem(mapName));
            let monsters = [];

            if (monsterStorage) {
                monsterStorage.forEach(monster => {
                    let m = new Monster();
                    m.clone(monster);
                    monsters.push(m);
                });
            }

            resolve(monsters);
        });
    }

    /**
     * Save a monster
     * @param mapName
     * @param monster
     * @returns {Promise}
     */
    saveMonster(mapName, monster) {
        return new Promise((resolve, reject) => {
            if (!monster) {
                return reject(new Error('Error while saving monster, monster is invalid.'));
            }

            if (!monster) {
                return reject(new Error('Error while saving monster, map is invalid.'));
            }

            if (!monster.id) {
                monster.id = this.uuid.v4();
            }

            this.getMonsters(mapName).then(monsters => {
                monsters.push(monster);
                localStorage.setItem(mapName, JSON.stringify(monsters));
                resolve(monster);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Delete a monster
     * @param mapName
     * @param monster
     * @returns {Promise}
     */
    moveMonster(mapName, monster) {
        return new Promise((resolve, reject) => {
            this.getMonsters(mapName).then(monsters => {
                let m = monsters.find(m => m.id === monster.id);
                if(m) {
                    m.row = monster.row;
                    m.col = monster.col;
                    localStorage.setItem(mapName, JSON.stringify(monsters));
                    resolve(m);
                }
                reject(new Error('Error while moving, moved monster does not exist anymore.'));
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Update a monster
     * @param mapName
     * @param monster
     * @returns {Promise}
     */
    updateMonster(mapName, monster) {
        return new Promise((resolve, reject) => {
            this.getMonsters(mapName).then(monsters => {
                let m = monsters.find(m => m.id === monster.id);
                if(m) {
                    m.clone(monster);
                    localStorage.setItem(mapName, JSON.stringify(monsters));
                    resolve(m);
                }
                reject(new Error('Error while updating, monster does not exist anymore.'));
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Delete a monster
     * @param mapName {string}
     * @param monster {Monster}
     * @returns {Promise}
     */
    deleteMonster(mapName, monster) {
        return new Promise((resolve, reject) => {
            this.getMonsters(mapName).then(monsters => {
                let m = monsters.find(m => m.id === monster.id);
                if(m) {
                    monsters = monsters.filter(monster => monster.id !== m.id);
                    localStorage.setItem(mapName, JSON.stringify(monsters));
                    resolve();
                }
                reject(new Error('Error while removing, monster does not exist anymore.'));
            }).catch(error => {
                reject(error);
            });
        });
    }
}
