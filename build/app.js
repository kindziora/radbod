import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
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
        var _a, _b, _c, _d, _e;
        let s;
        if (data instanceof store) {
            s = data;
        }
        else {
            s = this.dataH.createStore(name, data);
        }
        let el = document.createElement("component");
        el.innerHTML = (_a = views) === null || _a === void 0 ? void 0 : _a[name];
        let ddom = new dom(el, injections, s);
        ddom.name = name;
        el.setAttribute("data-name", name);
        this.components[name] = new component(ddom, s, actions);
        if (typeof ((_b = views) === null || _b === void 0 ? void 0 : _b[name]) !== "function") {
            let stores = (_d = Object.keys((_c = this.dataH) === null || _c === void 0 ? void 0 : _c.store)) === null || _d === void 0 ? void 0 : _d.join(',');
            this.components[name].dom.setTemplate(eval('(change,' + stores + ')=>`' + this.components[name].dom._area.innerHTML + '`'));
        }
        else {
            this.components[name].dom.setTemplate((_e = views) === null || _e === void 0 ? void 0 : _e[name]);
        }
        return this.components[name];
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
