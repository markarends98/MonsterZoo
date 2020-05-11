// import classes
import Raining from "../images/rain.svg";
import Sun from "../images/sun.svg";
import {WeatherApi} from "../api/WeatherApi";

const Celsius = '\xB0C';

export class WeatherComponent extends HTMLElement {
    static get HtmlTag() {
        return 'weather-component';
    }

    constructor() {
        super();
        let instance = this;
        window.addEventListener(WeatherApi.weatherChangedEvent, evt => {
            instance.showWeather(evt.detail);
        });
    }

    /**
     * Create view elements
     */
    connectedCallback() {
        // remove child elements
        this.innerHTML = '';

        // create elements
        this.weatherIcon = document.createElement('img');
        this.weatherIcon.id = 'ic-weather';
        this.temperature = document.createElement('span');
        this.temperature.id = 'ic-temperature';
        this.textNode = document.createTextNode('');
        this.temperature.appendChild(this.textNode);

        // add elements
        this.appendChild(this.weatherIcon);
        this.appendChild(this.temperature);
    }

    /**
     * Show weather in html
     * @param weather
     */
    showWeather(weather) {
        this.weatherIcon.src = weather.isRaining ? Raining : Sun;
        this.textNode.nodeValue = weather.temperature + ' ' + Celsius.normalize(); // celsius unicode
    }
}
