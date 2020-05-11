export class ErrorComponent extends HTMLElement {
    static get HtmlTag() {
        return 'error-component';
    }

    connectedCallback() {
        this.classList.add('hide');
        this.errorNode = document.createTextNode('TEST ERROR');
        let button = document.createElement('button');
        button.setAttribute('class', 'close');
        let buttonText = document.createElement('span');
        buttonText.appendChild(document.createTextNode('X'));
        button.appendChild(buttonText);
        button.addEventListener('click', () => {
            this.classList.add('hide');
            if(this.timer) {
                clearTimeout(this.timer);
            }
        });

        this.appendChild(this.errorNode);
        this.appendChild(button);
    }

    /**
     * Show an error
     * @param error {Error}
     */
    showError(error) {
        if(error === null) {
            return;
        }

        if(error.message.trim().length === 0) {
            error.message = 'Unknown error occurred';
        }

        if(this.timer) {
            clearTimeout(this.timer);
        }

        this.classList.remove('hide');
        this.errorNode.nodeValue = error.message;

        this.timer = setTimeout(() => {
            this.classList.add('hide');
        }, 3000);
    }
}
