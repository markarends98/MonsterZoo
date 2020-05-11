export class FieldBoostConfig {
    /***
     * Get configuration for field boosts
     * @returns ({})
     */
    static get getConfig() {
        return {
            fire: [
                {
                    stat: 'attackModifier',
                    value: 4,
                    validate: (weather) => {
                        return !weather.isRaining && weather.temperature >= 20;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: 4,
                    validate: (weather) => {
                        return !weather.isRaining && weather.temperature >= 30;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: -5,
                    validate: (weather) => {
                        return weather.isRaining;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: -5,
                    validate: (weather) => {
                        return weather.temperature < 15;
                    }
                }
            ],
            water: [
                {
                    stat: 'attackModifier',
                    value: 5,
                    validate: (weather) => {
                        return weather.temperature <= 20 && weather.temperature >= 10;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: 5,
                    validate: (weather) => {
                        return weather.isRaining;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: -5,
                    validate: (weather) => {
                        return weather.temperature > 20;
                    }
                }
            ],
            earth: [
                {
                    stat: 'attackModifier',
                    value: 6,
                    validate: (weather) => {
                        return !weather.isRaining;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: -4,
                    validate: (weather) => {
                        return weather.temperature < 8;
                    }
                }
            ],
            wind: [
                {
                    stat: 'attackModifier',
                    value: 8,
                    validate: (weather) => {
                        return weather.temperature > 13;
                    }
                },
                {
                    stat: 'attackModifier',
                    value: -4,
                    validate: (weather) => {
                        return weather.temperature < 8;
                    }
                }
            ]
        }
    };
}
