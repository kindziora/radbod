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
    createComponent(name, views, data, actions, injections) {
        var _a, _b;
        let store = this.dataH.createStore(name, data);
        let el = document.createElement("component");
        el.innerHTML = (_a = views) === null || _a === void 0 ? void 0 : _a[name](data);
        el.setAttribute("data-name", name);
        this.components[name] = new component(new dom(el, injections), store, actions);
        this.components[name].dom.setTemplate((_b = views) === null || _b === void 0 ? void 0 : _b[name]);
        this.bindViews(name, views);
        return this.components[name];
    }
    /**
     *
     * @param name
     * @param views
     */
    bindViews(name, views) {
        var _a, _b, _c;
        for (let i in this.components[name].dom.element) {
            let el = this.components[name].dom.element[i];
            if (el.$el.hasAttribute("data-view")) {
                el.setTemplate((_a = views) === null || _a === void 0 ? void 0 : _a[(_c = (_b = el) === null || _b === void 0 ? void 0 : _b.$el) === null || _c === void 0 ? void 0 : _c.getAttribute("data-view")]);
            }
        }
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
