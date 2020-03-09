import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
import { i18n } from './i18n.js';
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
    createComponent(name, views, data, actions, injections = {}, translations = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let s;
        if (data instanceof store) {
            s = data;
        }
        else {
            s = this.dataH.createStore(name, data);
        }
        let el = document.createElement("component");
        let storeArray = (_a = this.dataH) === null || _a === void 0 ? void 0 : _a.store.toArray();
        let internationalize = new i18n();
        internationalize.addTranslation(translations);
        let _t = (text, lang) => internationalize._t(text, lang);
        if (typeof ((_b = views) === null || _b === void 0 ? void 0 : _b[name]) === "function") {
            el.innerHTML = (_d = (_c = views) === null || _c === void 0 ? void 0 : _c[name]) === null || _d === void 0 ? void 0 : _d.apply(s, [{ value: "" }, ...storeArray, _t]);
        }
        else {
            el.innerHTML = (_e = views) === null || _e === void 0 ? void 0 : _e[name];
        }
        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;
        el.setAttribute("data-name", name);
        this.components[name] = new component(ddom, s, actions);
        console.log("COMPOS", this.components[name].loadStores());
        if (typeof ((_f = views) === null || _f === void 0 ? void 0 : _f[name]) !== "function") {
            let stores = (_h = (_g = this.dataH) === null || _g === void 0 ? void 0 : _g.store.keys()) === null || _h === void 0 ? void 0 : _h.join(',');
            this.components[name].dom.setTemplate(eval('(change,' + stores + ', _t)=>`' + this.components[name].dom._area.innerHTML + '`'));
        }
        else {
            this.components[name].dom.setTemplate((_j = views) === null || _j === void 0 ? void 0 : _j[name]);
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
