import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
export class app {
    constructor(environment) {
        this.components = {};
        this.sharedComponents = {};
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
        console.log(`mount component: ${name}`, this.loadStores(componentObject, (stores, meta, data) => {
            let compo = this.createComponent(name, data, componentObject);
            callback(stores, meta, compo);
        }));
    }
    setLanguage(languageCode) {
        this.dataH.internationalize.setLanguage(languageCode);
    }
    getLanguage(languageCode) {
        return this.dataH.internationalize.getLanguage();
    }
    /**
    *
    * @param name
    * @param html
    * @param data
    * @param actions
    * @param injections
    */
    createComponent(name, data, componentObject) {
        let componentID = name.split("#").length > 1 ? name.split("#")[1] : name;
        name = name.split("#").length > 1 ? name.split("#")[0] : name;
        data = (typeof data === "undefined" || typeof data.then === "function") ? this.dataH.createStore(name, {}) : data;
        if (!(data instanceof store))
            data = this.dataH.createStore(name, data);
        let el = document.createElement("component");
        this.dataH.internationalize.addTranslation(typeof componentObject.translations === "function" ? componentObject.translations.call() : componentObject.translations);
        this.dataH.internationalize.setLanguage(componentObject === null || componentObject === void 0 ? void 0 : componentObject.language);
        el.setAttribute("data-name", name);
        for (let name in componentObject.components) {
            if (typeof componentObject.components[name] === "string") {
                let nameID = componentObject.components[name].split("#").length > 0 ? componentObject.components[name].split("#")[1] : componentObject.components[name];
                componentObject.components[name] = this.components[nameID];
            }
        }
        let ddom = new dom(el, componentObject.components, data, componentObject === null || componentObject === void 0 ? void 0 : componentObject.views, this.dataH.internationalize);
        ddom.name = name;
        this.components[componentID] = ddom.createComponent(name, el, componentObject);
        return this.components[componentID];
    }
    /**
     *
     * @param componentID
     */
    removeComponent(componentID) {
        delete this.components[componentID];
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
                    allready(dataH, meta, data);
                }
            };
        };
        if (typeof component === "string") {
            let nameID = component.split("#").length > 0 ? component.split("#")[1] : component;
            component = this.components[nameID];
            //what now?
        }
        else {
            if (component.data) {
                let result;
                result = component.data.call(this.dataH, callback(meta, this.dataH), {});
                if (!result || typeof result.then !== "function") {
                    callback(meta, this.dataH)(result);
                }
                for (let i in component.components) {
                    this.fetchData(component.components[i], cb, allready, total, meta);
                }
            }
        }
    }
    countForData(component, cnt) {
        for (let i in component.components) {
            if (typeof component.components[i] !== "string")
                cnt = this.countForData(component.components[i], cnt);
        }
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
