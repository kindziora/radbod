import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
import { i18n } from './i18n.js';

export class app {
    public dataH: dataHandler;
    public components: { [index: string]: component } = {};
    private environment: Object;

    constructor(environment: Object) {

        this.environment = environment;

        this.dataH = new dataHandler(new eventHandler(), environment);

    }

    createComponent(name: string, componentObject: Object, callback: Function) {

        console.log("COMPOS", this.loadStores(componentObject, (stores, data)=>{
            
            let compo = this.createComponent(name, componentObject.views, componentObject.data.call(this.dataH), componentObject.interactions(), componentObject.components, componentObject.translations());

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
    createComponent(name: string, views: { [index: string]: string }, data: Object | store, actions: object, injections: object = {}, translations: object = {}) {
        let s;

        if (data instanceof store) {
            s = data;
        } else {
            s = this.dataH.createStore(name, data);
        }

        let el = document.createElement("component");

        let storeArray = this.dataH?.store.toArray();

        let internationalize = new i18n();
        internationalize.addTranslation(translations);

        let _t = (text: string, lang?: string) => internationalize._t(text, lang);

        if (typeof views?.[name] === "function") {

            el.innerHTML = views?.[name]?.apply(s, [{ value: "" }, ...storeArray, _t]);
        } else {
            el.innerHTML = views?.[name];
        }

        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;
        el.setAttribute("data-name", name);

        this.components[name] = new component(ddom, s, actions);

        if (typeof views?.[name] !== "function") {
            let stores = this.dataH?.store.keys()?.join(',');
            this.components[name].dom.setTemplate(eval('(change,' + stores + ', _t)=>`' + this.components[name].dom._area.innerHTML + '`'));
        } else {
            this.components[name].dom.setTemplate(views?.[name]);
        }

         return this.components[name];
    }

    /**
     * 
     * @param name 
     */
    removeComponent(name: string) {
        delete this.components[name];
    }

    /**
     * 
     * @param url 
     */
    render(url: string) {

    }


    private fetchData(component: object, cb: Function, allready: Function, total: number, meta: object) {

        let callback = function (meta, dataH) {
            return (data) => {
                cb(data);
                meta.cnt++;
                meta.loaded.push(component);
                if (meta.cnt >= total) {
                    allready(dataH, meta);
                }
            }
        };

        let result = component.data.call(this.store.dataH, callback(meta, this.store.dataH), {});

        if (typeof result.then !== "function") {
            meta.cnt++;
            meta.loaded.push(component);
        }

        for (let i in component.components) {
            this.fetchData(component.components[i], cb, allready, total, meta);
        }

        if (meta.cnt >= total) {
            allready(this.store.dataH, meta);
        }
    }

    private countForData(component: object, cnt: number) {
        for (let i in component.components)
            cnt = this.countForData(component.components[i], cnt);
        return ++cnt;
    }

    public loadStores(componentObject: object, cb: Function) {

        let count = this.countForData(componentObject, 0);
        let met = { cnt: 0, loaded: [] };

        this.fetchData(componentObject, (data) => {
        }, cb, count, met, this.dataH);
    }

}