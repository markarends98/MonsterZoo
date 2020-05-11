import {RadioGroupComponent} from "../components/RadioGroupComponent";

export class FormBuilder {
    constructor() {

    }

    /**
     * Create a form group element
     * @param labelText
     * @param formControl
     */
    createFormGroup(labelText, formControl) {
        let formGroup = document.createElement('div');
        if (labelText != null) {
            let label = document.createElement('label');
            let textNode = document.createTextNode(labelText);
            label.appendChild(textNode);
            formGroup.appendChild(label);
        }
        formGroup.appendChild(formControl);
        return formGroup;
    }

    /**
     * Create a select element
     * @param name
     * @returns {HTMLSelectElement}
     */
    createSelect(name) {
        let select = document.createElement('select');
        select.setAttribute('name', name);
        return select;
    }

    /**
     * Create an option element
     * @param value
     * @param text
     * @param selected
     * @returns {HTMLOptionElement}
     */
    createSelectOption(value, text, selected) {
        let option = document.createElement('option');
        option.setAttribute('value', value);
        if (selected)
            option.setAttribute('selected', '');
        let textNode = document.createTextNode(text);
        option.appendChild(textNode);
        return option;
    }

    /**
     * Create a button element
     * @param text
     * @returns {HTMLButtonElement}
     */
    createButton(text) {
        let button = document.createElement('button');
        let textNode = document.createTextNode(text);
        button.appendChild(textNode);
        return button;
    }

    /**
     * Create a small button element
     * @param text
     * @returns {HTMLButtonElement}
     */
    createButtonSmall(text) {
        let button = this.createButton(text);
        button.classList.add('small');
        return button;
    }

    /**
     * Create a radio group element
     * @param name
     * @returns {HTMLElement}
     */
    createRadioGroup(name) {
        let radioGroup = document.createElement(RadioGroupComponent.HtmlTag);
        radioGroup.setAttribute('name', name);
        return radioGroup;
    }

    /**
     * Create custom radio element
     * @param name
     * @param value
     * @param text
     * @param selected
     * @returns {HTMLLabelElement}
     */
    createRadioOption(name, value, text, selected) {
        let label = document.createElement('label');
        label.setAttribute('class', 'cRadio');
        let textNode = document.createTextNode(text);

        let radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        if (selected)
            radio.setAttribute('checked', '');

        radio.setAttribute('value', value);
        radio.setAttribute('name', name);

        let checkMark = document.createElement('span');
        checkMark.setAttribute('class', 'checkmark');

        label.appendChild(textNode);
        label.appendChild(radio);
        label.appendChild(checkMark);
        return label;
    }

    /**
     * Create a text input element
     * @param name
     * @returns {HTMLInputElement}
     */
    createTextInput(name) {
        let input = document.createElement('input');
        input.setAttribute('name', name);
        input.setAttribute('placeholder', name);
        return input;
    }

    /**
     * Create a form element for the specified type
     * @param controlDefinition
     * @returns {HTMLElement}
     */
    createFormElement(controlDefinition) {
        switch (controlDefinition.type) {
            case 'text':
                return this.createTextInput(controlDefinition.name);
            case 'select':
                return this.createSelect(controlDefinition.name);
            case 'radio':
                return this.createRadioGroup(controlDefinition.name);
        }
    }

    /**
     * Create an option element for the specified type
     * @param type
     * @param name
     * @param value
     * @param label
     * @param selected
     * @returns {HTMLElement}
     */
    createOptionElement(type, name, value, label, selected) {
        switch (type) {
            case 'select':
                return this.createSelectOption(value, label, selected);
            case 'radio':
                return this.createRadioOption(name, value, label, selected);
        }
    }
}
