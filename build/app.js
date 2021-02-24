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
    replaceFunctionHeader(funcString, newFunctionHeader) {
        const functionHeader = /\([\w,\s]+\)+(\s+|)=>/m;
        return funcString.replace(functionHeader, `(${newFunctionHeader})=>`);
    }
    /**
     *
     * @param name
     * @param componentObject
     * @param callback
     */
    mountComponent(name, componentObject, callback) {
        console.log(`mount component: ${name}`, this.loadStores(componentObject, (stores, data) => {
            let compo = this.createComponent(name, componentObject.views, componentObject.data.call(this.dataH, function (data) {
                console.log(`DATA MAIN COMPONENT ${name}`, data);
            }), componentObject.interactions, componentObject.components, componentObject.translations(), componentObject);
            callback(stores, data, compo);
        }));
    }
    /**
    *
    * @param name
    * @param html
    * @param data
    * @param actions
    * @param injections
    */
    createComponent(name, views, data, actions, injections = {}, translations = {}, componentObject, style) {
        var _a, _b, _c, _d;
        let s;
        if (data instanceof store) {
            s = data;
        }
        else {
            s = this.dataH.createStore(name, data);
        }
        let el = document.createElement("component");
        let storeObject = (_a = this.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        let internationalize = new i18n();
        internationalize.addTranslation(translations);
        let _t = (text, lang) => internationalize._t(text, lang);
        if (typeof (views === null || views === void 0 ? void 0 : views[name]) === "function") {
            el.innerHTML = (_b = views === null || views === void 0 ? void 0 : views[name]) === null || _b === void 0 ? void 0 : _b.call(this, Object.assign(Object.assign({ change: { value: "" } }, storeObject), { _t }));
        }
        else {
            el.innerHTML = views === null || views === void 0 ? void 0 : views[name];
        }
        el.setAttribute("data-name", name);
        if (componentObject === null || componentObject === void 0 ? void 0 : componentObject.style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = componentObject.style;
            el.append(stEl);
        }
        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;
        let act = {};
        try {
            act = actions.call({ componentObject, dom: ddom });
        }
        catch (e) {
            console.log(e);
        }
        this.components[name] = new component(ddom, s, act);
        if (typeof (views === null || views === void 0 ? void 0 : views[name]) !== "function") {
            let args = (_d = (_c = this.dataH) === null || _c === void 0 ? void 0 : _c.store.keys()) === null || _d === void 0 ? void 0 : _d.join(',');
            this.components[name].dom.setTemplate(eval('(function(args){ let {change, ' + args + ', _t} = args; return `' + this.components[name].dom._area.innerHTML + '`})'));
        }
        else {
            this.components[name].dom.setTemplate(views === null || views === void 0 ? void 0 : views[name]);
        }
        if (typeof (componentObject === null || componentObject === void 0 ? void 0 : componentObject.mounted) === "function" && typeof (views === null || views === void 0 ? void 0 : views[name]) === "function") {
            componentObject === null || componentObject === void 0 ? void 0 : componentObject.mounted.call(this.components[name]);
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
    fetchData(component, cb, allready, total, meta) {
        let callback = function (meta, dataH) {
            return (data) => {
                cb(data, component);
                meta.cnt++;
                meta.loaded.push(component);
                if (meta.cnt >= total) {
                    allready(dataH, meta);
                }
            };
        };
        let result = component.data.call(this.dataH, callback(meta, this.dataH), {});
        if (!result || typeof result.then !== "function") {
            callback(meta, this.dataH)(result);
        }
        for (let i in component.components) {
            this.fetchData(component.components[i], cb, allready, total, meta);
        }
    }
    countForData(component, cnt) {
        for (let i in component.components)
            cnt = this.countForData(component.components[i], cnt);
        return ++cnt;
    }
    loadStores(componentObject, cb) {
        let count = this.countForData(componentObject, 0);
        let met = { cnt: 0, loaded: [] };
        this.fetchData(componentObject, (data, component) => {
            var _a;
            console.log("fetchData: ", data.name, data);
            component.environment = this.environment;
            (_a = component === null || component === void 0 ? void 0 : component.loaded) === null || _a === void 0 ? void 0 : _a.call(component, data);
        }, cb, count, met, this.dataH);
    }
}
