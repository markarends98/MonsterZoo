export class RadioGroupComponent extends HTMLElement {
    static get HtmlTag() {
        return 'radio-group-component';
    }

    constructor() {
        super();
    }

    /**
     * Return value of checked radio button
     * @returns {*}
     */
    get value() {
        let input = this.querySelector('input[type=radio]:checked');
        return input ? input.value : null;
    }

    /**
     * Check the correct radio button
     * @param val
     */
    set value(val) {
        let inputs = this.querySelectorAll('input[type=radio]');
        inputs.forEach(input => {
           if(input.value === val){
               input.setAttribute('checked','');
           }
        });
    }
}
