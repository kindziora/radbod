import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
export class app {
    constructor(environment) {
        this.components = {};
        this.environment = environment;
        this.dataH = new dataHandler(new eventHandler(), environment);
    }
    /**
        *
        * @param name
        * @param html
        * @param data
        * @param actions
        * @param injections
        */
    createComponent(name, views, data, actions, injections = {}) {
        var _a, _b, _c, _d, _e, _f, _g;
        let s;
        if (data instanceof store) {
            s = data;
        }
        else {
            s = this.dataH.createStore(name, data);
        }
        let el = document.createElement("component");
        if (typeof ((_a = views) === null || _a === void 0 ? void 0 : _a[name]) === "function") {
            el.innerHTML = (_b = views) === null || _b === void 0 ? void 0 : _b[name](data);
        }
        else {
            el.innerHTML = (_c = views) === null || _c === void 0 ? void 0 : _c[name];
        }
        let ddom = new dom(el, injections, s, views);
        ddom.name = name;
        el.setAttribute("data-name", name);
        this.components[name] = new component(ddom, s, actions);
        if (typeof ((_d = views) === null || _d === void 0 ? void 0 : _d[name]) !== "function") {
            let stores = (_f = (_e = this.dataH) === null || _e === void 0 ? void 0 : _e.store.keys()) === null || _f === void 0 ? void 0 : _f.join(',');
            this.components[name].dom.setTemplate(eval('(change,' + stores + ')=>`' + this.components[name].dom._area.innerHTML + '`'));
        }
        else {
            this.components[name].dom.setTemplate((_g = views) === null || _g === void 0 ? void 0 : _g[name]);
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
