import {FieldBoostConfig} from "../config/FieldBoostConfig";

export class FieldBoostService {
    constructor() {
        this.config = FieldBoostConfig.getConfig;
    }

    /**
     * Get field boosts
     * @param temp
     * @param isRaining
     * @returns {{}}
     */
    getFieldBoosts(temp, isRaining) {
        this.fieldBoosts = {}
        let types = Object.keys(this.config);

        types.forEach(type => {
            let typeObject = this.config[type];
            typeObject.forEach(modifier => {
                let valid = modifier.validate(temp, isRaining);
                if (valid) {

                    let boost = {
                        stat: modifier.stat,
                        value: modifier.value
                    }

                    if (this.fieldBoosts[type] !== undefined) {
                        this.fieldBoosts[type].value += boost.value;
                    } else {
                        this.fieldBoosts[type] = boost;
                    }
                }
            });
        });

        return this.fieldBoosts;
    }
}
