import {FieldBoostService} from "../services/FieldBoostService";
import {ErrorComponent} from "../components/ErrorComponent";

/**
 *  id's and names of rainy conditions
 *  url: https://openweathermap.org/weather-conditions
 */
const rainConditionIds = [200, 201, 202, 230, 231, 232];
const rainConditionNames = ['Rain', 'Drizzle'];

export class WeatherApi {

    static get weatherChangedEvent() {
        return 'onChangedWeather';
    }

    constructor() {
        this.fieldBoostService = new FieldBoostService();
        this.weatherInfo = {
            isRaining: false,
            temperature: 0
        };

        /**
         * Use weatherApi.changeWeather(bool, int) in the console to change the weather
         * @type {{changeWeather: Window.weatherApi.changeWeather}}
         */
        window.weatherApi = {
            changeWeather: (raining, temp) => {
                this.weatherInfo = {
                    isRaining: raining,
                    temperature: temp,
                    fieldBoosts: this.fieldBoostService.getFieldBoosts(temp, raining)
                };

                document.dispatchEvent(new CustomEvent(WeatherApi.weatherChangedEvent, {
                    bubbles: true,
                    detail: this.weatherInfo
                }));

                console.log(`Changed weather to: ${JSON.stringify(this.weatherInfo)}`)
            }
        };
    }

    /**
     * Return weather info by making a call to the openweathermap api
     * @param cityName
     */
    getWeather(cityName) {
        let apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=nl&units=metric`).then(response => {
            return response.json();
        }).then(response => {
            if(!response) {
                throw new Error();
            }
            this.weatherInfo = {
                isRaining: false,
                temperature: Math.round(response.main.temp)
            };

            for (let weatherCondition of response.weather) {
                if (rainConditionNames.includes(weatherCondition.main) || rainConditionIds.includes(weatherCondition.id)) {
                    this.weatherInfo.isRaining = true;
                    break;
                }
            }

            this.weatherInfo.fieldBoosts = this.fieldBoostService.getFieldBoosts(this.weatherInfo);

            document.dispatchEvent(new CustomEvent(WeatherApi.weatherChangedEvent, {
                bubbles: true,
                detail: this.weatherInfo
            }));
        }).catch(() => {
            let alert = document.querySelector(ErrorComponent.HtmlTag);
            if(alert) {
                alert.showError(new Error('Error while retrieving weather data, field boosts are currently not available'));
            }
        });
    }
}
