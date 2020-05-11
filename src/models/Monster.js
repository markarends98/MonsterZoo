export class Monster {
    constructor() {
        this.id = null;
        this.type = 'water';
        this.name = '';
        this.arms = 2;
        this.armType = 'tentacles';
        this.legs = 2;
        this.eyes = 2;
        this.fur = 'scales';
        this.canFly = false;
        this.canSwim = true;
        this.color = 'blue';
        this.image = '';

        this.hp = Math.floor(Math.random() * (100 - 60 + 1) + 60);
        this.attackPower = Math.floor(Math.random() * (100 - 60 + 1) + 60);
        this.defensePower = Math.floor(Math.random() * (100 - 60 + 1) + 60);
        this.attackModifier = 0;
        this.defenseModifier = 0;
        this.row = 0;
        this.col = 0;
    }

    get attack() {
        return this.attackModifier + this.attackPower;
    }

    get defense() {
        return this.defenseModifier + this.defensePower;
    }

    get monsterType() {
        if (this.type == null) {
            return 'water';
        }
        return this.type;
    }

    get attackMove() {
        switch (this.monsterType.toLowerCase()) {
            case 'water':
                return 'Hydro pump';
            case 'fire' :
                return 'Flamethrower';
            case 'wind':
                return 'Hurricane';
            case 'earth':
                return 'Earthquake';
        }
    }

    /**
     * Apply field boost to monster
     * @param fieldBoosts {{}}
     */
    applyFieldBoost(fieldBoosts) {
        this.attackModifier = 0;
        this.defenseModifier = 0;

        if (fieldBoosts.hasOwnProperty(this.monsterType)) {
            let fieldBoost = fieldBoosts[this.monsterType];
            if (this.hasOwnProperty(fieldBoost.stat)) {
                this[fieldBoost.stat] += fieldBoost.value;
            }
        }
    }

    /**
     * Clone a monsters or objects data
     * @param monster {{}}
     */
    clone(monster) {
        Object.keys(monster).forEach(key => {
            if(this.hasOwnProperty(key)) {
                this[key] = monster[key];
            }
        });
    }

    /**
     * Bind tile to monster
     * @param tile {Tile}
     */
    bindTile(tile) {
        this.col = tile.col;
        this.row = tile.row
    }
}
