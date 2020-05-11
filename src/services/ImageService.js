import Water1 from "../images/monsters/water/Water1.png";
import Water2 from "../images/monsters/water/Water2.png";
import Water3 from "../images/monsters/water/Water3.png";
import Water4 from "../images/monsters/water/Water4.png";
import Earth1 from "../images/monsters/earth/Earth1.png";
import Earth2 from "../images/monsters/earth/Earth2.png";
import Earth3 from "../images/monsters/earth/Earth3.png";
import Earth4 from "../images/monsters/earth/Earth4.png";
import Fire1 from "../images/monsters/fire/Fire1.png";
import Fire2 from "../images/monsters/fire/Fire2.png";
import Fire3 from "../images/monsters/fire/Fire3.png";
import Fire4 from "../images/monsters/fire/Fire4.png";
import Wind1 from "../images/monsters/wind/Wind1.png";
import Wind2 from "../images/monsters/wind/Wind2.png";
import Wind3 from "../images/monsters/wind/Wind3.png";
import Wind4 from "../images/monsters/wind/Wind4.png";

export class ImageService {
    constructor() {
        this.images = {
            water: [ Water1, Water2, Water3, Water4 ],
            fire: [ Fire1, Fire2, Fire3, Fire4 ],
            earth: [ Earth1, Earth2, Earth3, Earth4 ],
            wind: [ Wind1, Wind2, Wind3, Wind4 ]
        };
    }

    /**
     * Get a new image for monster
     * @param monster {Monster}
     * @returns {Promise<string>}
     */
    getImage(monster) {
        return new Promise((resolve, reject) => {
            if(this.images.hasOwnProperty(monster.type)) {
                let images = this.images[monster.type].filter(image => image !== monster.image);
                if(images && images.length > 0) {
                    return resolve(images[Math.floor(Math.random() * images.length)]);
                }
            }
            reject(new Error('No image available.'));
        });
    }
}
