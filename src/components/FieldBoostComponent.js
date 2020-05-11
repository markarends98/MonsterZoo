import {WeatherApi} from "../api/WeatherApi";

export class FieldBoostComponent extends HTMLElement {
    static get HtmlTag() {
        return 'field-boost-component';
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute('class', 'hide');
        this.container = document.createElement('div');
        this.container.setAttribute('class', 'field-boost-container');
        this.appendChild(this.container);

        document.addEventListener(WeatherApi.weatherChangedEvent, evt => {
           this.draw(evt.detail.fieldBoosts);
        });
    }

    /**
     * Draw the field boost component
     * @param fieldBoosts
     */
    draw(fieldBoosts) {
        while(this.container.lastElementChild) {
            this.container.removeChild(this.container.lastElementChild);
        }

        let keys = Object.keys(fieldBoosts);
        if(keys.length === 0) {
            this.setAttribute('class', 'hide');
        }else {
            this.removeAttribute('class');

            let increasedWrapper = this.createFieldBoostWrapper('stronger');
            let decreasedWrapper = this.createFieldBoostWrapper('weaker');
            keys.forEach(type => {
                let fieldBoost = fieldBoosts[type];
                let typeLabel = this.createFieldBoostLabel(type);

                if(fieldBoost.value > 0) {
                    increasedWrapper.appendChild(typeLabel);
                }else if(fieldBoost.value < 0) {
                    decreasedWrapper.appendChild(typeLabel);
                }
            });

            if(increasedWrapper.children.length > 1) {
                this.container.appendChild(increasedWrapper);
            }

            if(decreasedWrapper.children.length > 1) {
                this.container.appendChild(decreasedWrapper);
            }
        }
    }

    /**
     * Create a field boost label
     * @param type
     * @returns {HTMLLabelElement}
     */
    createFieldBoostLabel(type) {
        let fieldBoostLabel = document.createElement('label');
        fieldBoostLabel.setAttribute('class','type ' + type);
        fieldBoostLabel.appendChild(document.createTextNode(type));
        return fieldBoostLabel;
    }

    /**
     * Create a field boost group
     * @param label
     * @returns {HTMLDivElement}
     */
    createFieldBoostWrapper(label) {
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'field-boost-wrapper');
        let lbl = document.createElement('label');
        lbl.setAttribute('class','label-title');
        lbl.appendChild(document.createTextNode(label));
        wrapper.appendChild(lbl);
        return wrapper;
    }
}
