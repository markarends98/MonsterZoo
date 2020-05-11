import {Monster} from "../models/Monster";
import {Tile} from "../models/Tile";
import {MapController} from "../controllers/MapController";

export class TileComponent extends HTMLElement {
    static get HtmlTag() {
        return 'tile-component';
    }

    static get MonsterSelectedEvent() {
        return 'onMonsterSelected';
    }

    constructor() {
        super();

        this.row = 0;
        this.col = 0;
        this.tile = null;
    }

    connectedCallback() {
        this.draw();
    }

    /**
     * Draw tile
     */
    draw() {
        // remove listeners
        this.removeEventListener('dragend',  this.handleDragEnd);
        this.removeEventListener('dragstart', this.handleDragStart);
        this.removeEventListener('click', this.handleClick);
        this.removeEventListener('dragover', this.handleDragOver);
        this.removeEventListener('dragleave', this.handleDragLeave);
        this.removeEventListener('drop', this.handleDrop);

        // remove styling
        this.setAttribute('class', '');
        this.classList.add('tile');

        // Set obstacle image
        if (this.tile.hasObstacle) {
            let obstacleClass = 'obstacle-' + Math.floor(Math.random() * (3 - 1 + 1) + 1);
            this.classList.add(obstacleClass);
            return;
        }

        // Set monster image
        this.monsterImg = this.querySelector('img');
        if (this.tile.monster !== null) {
            if (!this.monsterImg) {
                this.monsterImg = document.createElement('img');

                this.monsterImg.classList.add('monster');
                this.appendChild(this.monsterImg);
            }

            this.monsterImg.src = this.tile.monster.image;
            this.classList.remove('empty-tile');
            this.classList.add('occupied');

            // Add listeners for moving monsters
            this.addEventListener('dragend',  evt => this.handleDragEnd(evt));
            this.addEventListener('dragstart', evt => this.handleDragStart(evt));
            this.addEventListener('click', evt => this.handleClick(evt));
        } else {
            // Allow drop on empty tiles
            this.addEventListener('dragover', evt => this.handleDragOver(evt));
            this.addEventListener('dragleave', evt => this.handleDragLeave(evt));
            this.addEventListener('drop', evt => this.handleDrop(evt));

            if (this.monsterImg) {
                this.monsterImg.remove();
            }
            this.classList.add('empty-tile');
            this.classList.remove('occupied');
        }
    }

    /**
     * Handle drag end event
     * @param evt {Event}
     */
    handleDragEnd(evt) {
        evt.preventDefault();
        this.classList.remove('hide');
    }

    /**
     * Handle click event
     * @param evt {Event}
     */
    handleClick(evt) {
        evt.preventDefault();

        this.dispatchEvent(new CustomEvent(TileComponent.MonsterSelectedEvent, {
            bubbles: true,
            detail: this.tile.monster
        }));
    }

    /**
     * Handle drag start event
     * Save data for drop event
     * @param evt {DragEvent}
     */
    handleDragStart(evt) {
        evt.dataTransfer.setData('oldTile', JSON.stringify(this));
        evt.dataTransfer.setData('monster', JSON.stringify(this.tile.monster));

        requestAnimationFrame(() => {
            this.classList.add('hide');
        });
    }

    /**
     * Handle drag over event
     * Add styling to tile
     * @param evt {DragEvent}
     */
    handleDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        let target = evt.target;
        if(!target.classList.contains('dragover')) {
            target.classList.add('dragover');
        }
    }

    /**
     * Handle drag leave event
     * Remove styling from tile
     * @param evt {DragEvent}
     */
    handleDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        let target = evt.target;
        if(target.classList.contains('dragover')) {
            target.classList.remove('dragover');
        }
    }

    /**
     * Handle drop event
     * Move monster to new tile
     * @param evt {DragEvent}
     */
    handleDrop(evt) {
        evt.preventDefault();

        // get data
        let monsterData = JSON.parse(evt.dataTransfer.getData('monster'));
        let oldTileData = JSON.parse(evt.dataTransfer.getData('oldTile'));

        // parse to objects
        let monster = new Monster();
        monster.clone(monsterData);
        let oldTile = new Tile();
        oldTile.clone(oldTileData);

        let data = {
            monster: monster,
            oldTile: oldTile,
            newTile: this
        };

        // tell MapController to move monster
        this.dispatchEvent(new CustomEvent(MapController.MonsterMovedEvent, {
            bubbles: true,
            detail: data
        }));
    }

    /**
     * Let monster on tile react
     * @param direction {string}
     */
    react(direction) {
        if(!this.tile.monster) {
            return;
        }

        return new Promise(resolve => {
            this.startAnimation(direction);
            let reactAnim = new Promise(resolve => {
                let maxPos = 50;
                let instance = this;
                let anim1 = new Promise(resolve => {
                    let pos = 0;
                    let anim = requestAnimationFrame(frame);
                    function frame() {
                        if (pos === maxPos) {
                            cancelAnimationFrame(anim);
                            resolve();
                        } else {
                            pos++;
                            instance.animateImage(direction, pos);
                        }
                        requestAnimationFrame(frame);
                    }
                });

                anim1.then(() => {
                    let pos = maxPos;
                    let secondAnim = requestAnimationFrame(frame);
                    function frame() {
                        if (pos === 0) {
                            cancelAnimationFrame(secondAnim);
                            resolve();
                        } else {
                            pos--;
                            instance.animateImage(direction, pos);
                        }
                        requestAnimationFrame(frame);
                    }
                });
            });

            reactAnim.then(() => {
                this.animationDone(direction);
                resolve();
            });
        });
    }

    /**
     * Animate monster image
     * @param direction
     * @param pos
     */
    animateImage(direction, pos) {
        let trans = undefined;
        if(direction === 'top') {
            trans = 'translateY(' + -Math.abs(pos) + 'px)';
        }else if(direction === 'right') {
            trans = 'translateX(' + -Math.abs(pos) + 'px)';
        }else if(direction === 'bottom') {
            trans = 'translateY(' + Math.abs(pos) + 'px)';
        }else if(direction === 'left') {
            trans = 'translateX(' + Math.abs(pos) + 'px)';
        }

        if(trans) {
            this.monsterImg.style.transform = trans;
        }
    }

    /**
     * Prepare for animation, remove listeners and add css style
     * @param direction
     */
    startAnimation(direction) {
        this.removeEventListener('dragstart', this.handleDragStart);
        this.removeEventListener('click', this.handleClick);
        this.classList.add('react');
        this.classList.add(direction);
    }

    /**
     * After animation is done add listeners and remove css style
     * @param direction
     */
    animationDone(direction) {
        this.addEventListener('dragstart', evt => this.handleDragStart(evt));
        this.addEventListener('click', evt => this.handleClick(evt));
        this.classList.remove('react');
        this.classList.remove(direction);
    }
}
