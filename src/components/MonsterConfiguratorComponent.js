import {Monster} from "../models/Monster.js";
import {FormBuilder} from "../builders/FormBuilder";
import {MonsterConfiguratorConfig} from "../config/MonsterConfiguratorConfig";
import {ImageService} from "../services/ImageService";
import {ErrorComponent} from "./ErrorComponent";

export class MonsterConfiguratorComponent extends HTMLElement {
    static get HtmlTag() {
        return 'monster-configurator-component';
    }

    static get MonsterCreatedEvent() {
        return 'onMonsterCreated';
    }

    static get MonsterUpdatedEvent() {
        return 'onMonsterUpdated';
    }

    static get MonsterDroppedEvent() {
        return 'onMonsterDropped';
    }

    static get MonsterResetDroppedEvent() {
        return 'onResetMonsterDropped';
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.insert = true;
        this.monster = new Monster();
        this.monsterImageService = new ImageService();
        this.formBuilder = new FormBuilder();
        this.formControlDefinitions = MonsterConfiguratorConfig.getConfig;
        this.formControls = [];
        this.buildControls();
        this.addEventListener('dragover', evt => this.handleDragOver(evt));
        this.addEventListener('drop', evt => this.handleDrop(evt));
    }

    /**
     * Create monster preview
     */
    addMonsterPreview() {
        this.monsterPreview = document.createElement('img');
        this.monsterPreview.classList.add('monster-preview');
        this.monsterPreview.classList.add('center');
        this.updatePreview();

        let monsterPreviewWrapper = document.createElement('div');
        monsterPreviewWrapper.classList.add('monster-preview-wrapper');
        monsterPreviewWrapper.appendChild(this.monsterPreview);

        let changePreviewButton = this.formBuilder.createButtonSmall('change');
        changePreviewButton.classList.add('center');
        changePreviewButton.addEventListener('click', () => this.updatePreview());

        let monsterPreviewContainer = this.formBuilder.createFormGroup(null, monsterPreviewWrapper);
        monsterPreviewContainer.classList.add('monster-preview-container');

        monsterPreviewContainer.appendChild(changePreviewButton);
        this.appendChild(monsterPreviewContainer);
    }

    /**
     * Update the monster preview
     */
    updatePreview() {
        this.monsterImageService.getImage(this.monster).then(image => {
            this.monster.image = image;
            this.monsterPreview.setAttribute('src', image);
        }).catch(error => {
            let alert = document.querySelector(ErrorComponent.HtmlTag);
            if(alert) {
                alert.showError(error);
            }
        });
    }

    /**
     * Build all form controls specified
     */
    buildControls() {
        this.addMonsterPreview();
        this.formControlDefinitions.forEach(controlDefinition => {
            let control = this.formBuilder.createFormElement(controlDefinition);

            if (controlDefinition.hasOwnProperty('options')) {
                control.addEventListener('change', () => {
                    let value = control.value;

                    if (controlDefinition.hasOwnProperty('converter')) {
                        value = controlDefinition.converter(value);
                    }

                    this.monster[controlDefinition.name] = value;
                    this.fillOptions();

                    if(controlDefinition.hasOwnProperty('updatePreview') && controlDefinition.updatePreview) {
                        this.updatePreview();
                    }
                });
            }

            this.formControls[controlDefinition.name] = control;
            this.appendChild(this.formBuilder.createFormGroup(controlDefinition.label, control));
        });
        this.addButtons();
        this.addMessageField();
        this.fillOptions();
    }

    /**
     * Add error message field
     */
    addMessageField() {
        this.messageField = document.createElement('span');
        this.messageField.setAttribute('class', 'message');
        this.messageNode = document.createTextNode('placeholder');
        this.messageField.appendChild(this.messageNode);
        this.appendChild(this.messageField);
    }

    /**
     * Fill all controls with options
     */
    fillOptions() {
        this.formControlDefinitions.forEach(controlDefinition => {
            if (!controlDefinition.hasOwnProperty('options'))
                return;

            let control = this.formControls[controlDefinition.name];

            if (control === undefined)
                return;

            // remove options
            while (control.lastElementChild != null)
                control.removeChild(control.lastElementChild);

            // loop through all options
            controlDefinition.options.forEach(option => {
                let optionIsValid;

                if (option.hasOwnProperty('condition')) {
                    let conditionsMet = true;

                    // loop through conditions
                    option.condition.some((conditionObject, nr) => {
                        conditionsMet = true;

                        // loop through sub conditions
                        Object.keys(conditionObject).forEach(conditionName => {
                            let conditionValue = conditionObject[conditionName];
                            let value = this.monster[conditionName];

                            // check if condition is met
                            if (Array.isArray(conditionValue)) {
                                if (!conditionValue.includes(value)) {
                                    conditionsMet = false;
                                }
                            } else if (conditionValue !== value) {
                                conditionsMet = false;
                            }
                        });

                        return conditionsMet;
                    });
                    optionIsValid = conditionsMet;
                } else {
                    optionIsValid = true;
                }

                // add option
                if (optionIsValid) {
                    let selected = this.monster[controlDefinition.name] === option.value;
                    const optionElement = this.formBuilder.createOptionElement(controlDefinition.type, controlDefinition.name, option.value, option.label, selected);
                    control.appendChild(optionElement);
                }
            });
        });
    }

    /**
     * Reset form values
     */
    resetForm() {
        this.insert = true;
        this.monster = new Monster();

        this.clearValues();
        this.fillOptions();
        this.updatePreview();
    }

    /**
     * Add save and reset button
     */
    addButtons() {
        let btnSave = this.formBuilder.createButton('save');
        this.btnReset = this.formBuilder.createButton('reset');

        btnSave.addEventListener('click', evt => this.handleSaveClick(evt));
        this.btnReset.addEventListener('click', evt => this.handleResetClick(evt));

        this.appendChild(this.formBuilder.createFormGroup(null, btnSave));
        this.appendChild(this.formBuilder.createFormGroup(null, this.btnReset));
    }

    /**
     * Handler for save button click
     * Inserts or updates a monster
     * @param evt {Event}
     */
    handleSaveClick(evt) {
        this.bindMonster();

        // validate monster
        let valid = true;
        this.formControlDefinitions.filter(definition => definition.hasOwnProperty('validator')).every(controlDefinition => {
            if (controlDefinition.validator.hasOwnProperty('validate')) {
                let value = this.monster[controlDefinition.name];
                let validationPassed = controlDefinition.validator.validate(value);

                if (!validationPassed) {
                    if (controlDefinition.validator.hasOwnProperty('error')) {
                        this.showError(controlDefinition.validator.error);
                    }

                    valid = false;
                }
                return validationPassed;
            }
        });

        // passed validation
        if (valid) {
            if(this.insert) {
                this.dispatchEvent(new CustomEvent(MonsterConfiguratorComponent.MonsterCreatedEvent, {
                    bubbles: true,
                    detail: this.monster
                }));
            }else {
                this.btnReset.innerText = 'reset';
                this.dispatchEvent(new CustomEvent(MonsterConfiguratorComponent.MonsterUpdatedEvent, {
                    bubbles: true,
                    detail: this.monster
                }));
            }
            this.resetForm();
        }
    }

    /**
     * Handler for reset button click
     * Resets the form to default monster
     * @param evt {Event}
     */
    handleResetClick(evt) {
        console.log(evt);
        if(!this.insert) {
            this.btnReset.innerText = 'reset';

            this.dispatchEvent(new CustomEvent(MonsterConfiguratorComponent.MonsterResetDroppedEvent, {
                bubbles: true,
                detail: this.monster
            }));
        }
        this.resetForm();
    }

    /**
     * Show an error message
     * @param errorMessage {string}
     */
    showError(errorMessage) {
        this.messageField.setAttribute('class', 'message show');
        this.messageField.classList.add('error');
        this.messageNode.nodeValue = errorMessage;
    }

    /**
     * Bind all control values to monster
     */
    bindMonster() {
        this.formControlDefinitions.forEach(controlDefinition => {
            let control = this.formControls[controlDefinition.name];
            if (control !== undefined && this.monster.hasOwnProperty(controlDefinition.name)) {
                let value = control.value;
                if (controlDefinition.hasOwnProperty('converter')) {
                    value = controlDefinition.converter(value);
                }
                this.monster[controlDefinition.name] = value;
            }
        });
    }

    /**
     * Handle drop event
     * Prepare monster for update
     * @param evt {DragEvent}
     */
    handleDrop(evt) {
        evt.preventDefault();

        if(!this.insert) {
            this.showError('There already is an monster in the configurator.');
            return;
        }

        // get data
        let monsterData = JSON.parse(evt.dataTransfer.getData('monster'));

        // parse to objects
        let monster = new Monster();
        monster.clone(monsterData);

        this.dispatchEvent(new CustomEvent(MonsterConfiguratorComponent.MonsterDroppedEvent, {
            bubbles: true,
            detail: monster
        }));
        this.btnReset.innerText = 'cancel';

        this.monster.clone(monster);
        this.insert = false;

        this.fillOptions();
        this.bindMonsterToConfigurator(monster);
    }

    /**
     * Handle drag over event
     * Add styling to configurator
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
     * Bind a monster's value to the configurator
     * @param monster
     */
    bindMonsterToConfigurator(monster) {
        Object.keys(monster).forEach(key => {
            let controlDefinition = this.formControlDefinitions.find(controlDefinition => controlDefinition.name === key);
            if(controlDefinition) {
                let control = this.formControls[controlDefinition.name];
                control.value = monster[key];
            }
        });

        this.monsterPreview.setAttribute('src', monster.image);
    }

    /**
     * Clear control values
     */
    clearValues() {
        this.formControlDefinitions.forEach(controlDefinition => {
            let control = this.formControls[controlDefinition.name];
            if (control) {
                control.value = '';
            }
        });
    }
}
