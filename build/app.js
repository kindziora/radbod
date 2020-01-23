import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
export class app {
    constructor() {
        this.components = {};
        this.dataH = new dataHandler(new eventHandler());
    }
    /**
     *
     * @param name
     */
    removeComponent(name) {
        delete this.components[name];
    }
    /**
     *
     * @param url
     */
    render(url) {
    }
}
