import {TileComponent} from "./TileComponent";

export class MonsterStatsComponent extends HTMLElement {
    static get HtmlTag() {
        return 'monster-stats-component';
    }

    static get RemoveMonsterEvent() {
        return 'onRemoveMonster';
    }

    constructor() {
        super();

        let instance = this;
        window.addEventListener(TileComponent.MonsterSelectedEvent, evt => {
            instance.showMonster(evt.detail);
        });
    }

    connectedCallback() {
        this.timer = null;
        this.setAttribute('class', 'hide');

        // Header
        let header = document.createElement('div');
        header.setAttribute('class', 'card-header fill space-between');

        // Name
        let lblName = document.createElement('label');
        lblName.setAttribute('class', 'card-name');
        this.nodeMonsterName = document.createTextNode('');
        lblName.appendChild(this.nodeMonsterName);

        // Hp
        let lblHp = document.createElement('label');
        lblHp.setAttribute('class', 'card-hp');
        this.nodeMonsterHp = document.createTextNode('');
        let hp = document.createElement('label');
        hp.appendChild(document.createTextNode(' HP'));
        lblHp.appendChild(this.nodeMonsterHp);
        lblHp.appendChild(hp);

        header.appendChild(lblName);
        header.appendChild(lblHp);

        // Image
        let imageFrame = document.createElement('div');
        imageFrame.setAttribute('class', 'card-image-frame');
        this.monsterImage = document.createElement('img');
        imageFrame.appendChild(this.monsterImage);

        // Show stats
        let stats = document.createElement('div');
        stats.setAttribute('class', 'card-stats fill');

        // Type
        let typeDiv = document.createElement('div');
        let typeLbl = document.createElement('label');
        typeLbl.setAttribute('class', 'type');
        this.nodeMonsterType = document.createTextNode('');
        typeLbl.appendChild(this.nodeMonsterType);
        typeDiv.appendChild(typeLbl);
        stats.appendChild(typeDiv);

        // Divider
        let divider1 = document.createElement('div');
        divider1.setAttribute('class', 'divider');
        stats.appendChild(divider1);

        // Attack stats
        let attackDiv = document.createElement('div');
        attackDiv.setAttribute('class', 'fill space-between');
        let lblAttackName = document.createElement('label');
        let lblAttackPower = document.createElement('label');
        this.monsterAttackName = document.createTextNode('');
        this.monsterAttackPower = document.createTextNode('');
        this.supAttackPower = document.createElement('sup');
        this.monsterAttackPowerBonus = document.createTextNode('');
        this.supAttackPower.appendChild(this.monsterAttackPowerBonus);
        lblAttackName.appendChild(this.monsterAttackName);
        lblAttackPower.appendChild(this.monsterAttackPower);
        lblAttackPower.appendChild(this.supAttackPower);
        attackDiv.appendChild(lblAttackName);
        attackDiv.appendChild(lblAttackPower);
        stats.appendChild(attackDiv);

        // Divider
        let divider2 = document.createElement('div');
        divider2.setAttribute('class', 'divider');
        stats.appendChild(divider2);

        // Defense stats
        let defenseDiv = document.createElement('div');
        defenseDiv.setAttribute('class', 'fill space-between');
        let lblDefense = document.createElement('label');
        let lblDefensePower = document.createElement('label');
        let monsterDefense = document.createTextNode('DEFENSE');
        this.monsterDefensePower = document.createTextNode('');

        this.supDefensePower = document.createElement('sup');
        this.monsterDefensePowerBonus = document.createTextNode('');
        this.supDefensePower.appendChild(this.monsterDefensePowerBonus);
        lblDefense.appendChild(monsterDefense);
        lblDefensePower.appendChild(this.monsterDefensePower);
        lblDefensePower.appendChild(this.supDefensePower);
        defenseDiv.appendChild(lblDefense);
        defenseDiv.appendChild(lblDefensePower);
        stats.appendChild(defenseDiv);

        let button = document.createElement('button');
        button.setAttribute('class', 'delete');
        button.appendChild(document.createTextNode('delete'));
        this.appendChild(header);
        this.appendChild(imageFrame);
        this.appendChild(stats);
        this.appendChild(button);

        this.addEventListener('click', evt => {
            this.classList.add('hide');
            if(evt.target === button) {
                this.dispatchEvent(new CustomEvent(MonsterStatsComponent.RemoveMonsterEvent, {
                    bubbles: true,
                    detail: this.monster
                }));
            }
        });


    }

    /**
     * Show monster stats
     * @param monster {Monster}
     */
    showMonster(monster) {
        if(!monster) {
            return;
        }

        this.monster = monster;
        this.resetValues();
        this.setAttribute('class', monster.type);

        this.nodeMonsterName.nodeValue = monster.name;
        this.nodeMonsterHp.nodeValue = monster.hp.toString();
        this.monsterImage.setAttribute('src', monster.image);
        this.nodeMonsterType.nodeValue = monster.type;
        this.monsterAttackName.nodeValue = monster.attackMove;
        this.monsterAttackPower.nodeValue = monster.attack;
        this.monsterDefensePower.nodeValue = monster.defense;

        if(monster.attackModifier !== 0) {
            let prefix = monster.attackModifier > 0 ? '+' : '';
            let _class = monster.attackModifier > 0 ? 'increase' : 'decrease';
            this.supAttackPower.setAttribute('class', _class);
            this.monsterAttackPowerBonus.nodeValue = prefix + '' + monster.attackModifier;
        }

        if(monster.defenseModifier !== 0) {
            let prefix = monster.defenseModifier > 0 ? '+' : '';
            let _class = monster.defenseModifier > 0 ? 'increase' : 'decrease';
            this.supDefensePower.setAttribute('class', _class);
            this.monsterDefensePowerBonus.nodeValue = prefix + '' + monster.defenseModifier;
        }
    }

    /**
     * Reset values to empty
     */
    resetValues() {
        this.setAttribute('class', '');
        this.nodeMonsterName.nodeValue = '';
        this.nodeMonsterHp.nodeValue = '';
        this.monsterImage.setAttribute('src', '');
        this.nodeMonsterType.nodeValue = '';
        this.monsterAttackName.nodeValue = '';
        this.monsterAttackPower.nodeValue = '';
        this.monsterDefensePower.nodeValue = '';
        this.monsterAttackPowerBonus.nodeValue = '';
        this.monsterDefensePowerBonus.nodeValue = '';
    }
}
