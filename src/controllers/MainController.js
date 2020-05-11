// import classes
import {MapController} from "./MapController";

// import custom components
import {MonsterConfiguratorComponent} from "../components/MonsterConfiguratorComponent";
import {WeatherComponent} from "../components/WeatherComponent";
import {MapComponent} from "../components/MapComponent";
import {TileComponent} from "../components/TileComponent";
import {RadioGroupComponent} from "../components/RadioGroupComponent";
import {FieldBoostComponent} from "../components/FieldBoostComponent";
import {MonsterStatsComponent} from "../components/MonsterStatsComponent";
import {ErrorComponent} from "../components/ErrorComponent";
// import styles
import "../css/style.css";

export class MainController {
    constructor() {
        // create custom components
        window.customElements.define(MonsterConfiguratorComponent.HtmlTag, MonsterConfiguratorComponent);
        window.customElements.define(WeatherComponent.HtmlTag, WeatherComponent);
        window.customElements.define(MapComponent.HtmlTag, MapComponent);
        window.customElements.define(TileComponent.HtmlTag, TileComponent);
        window.customElements.define(RadioGroupComponent.HtmlTag, RadioGroupComponent);
        window.customElements.define(FieldBoostComponent.HtmlTag, FieldBoostComponent);
        window.customElements.define(MonsterStatsComponent.HtmlTag, MonsterStatsComponent);
        window.customElements.define(ErrorComponent.HtmlTag, ErrorComponent);

        // init controllers
        this.mapController = new MapController();
    }

    /**
     * Load first map
     */
    load() {
        this.mapController.load();
    }
}
