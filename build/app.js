import { component } from "./component.js";
import { dom } from './dom.js';
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
     * @param html
     * @param data
     * @param actions
     * @param injections
     */
    createComponent(name, html, data, actions, injections) {
        let store = this.dataH.createStore(name, data);
        let el = document.createElement("div");
        el.outerHTML = html;
        el.setAttribute("data-name", name);
        this.components[name] = new component(new dom(el, injections), store, actions);
        return this.components[name];
    }
    removeComponent() {
    }
    /**
     *
     * @param url
     */
    render(url) {
    }
}
