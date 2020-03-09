import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
import { i18n } from './i18n.js';

export class app {
    public dataH: dataHandler;
    public components: { [index: string]: component } = {};
    private environment : Object;

    constructor(environment : Object) {

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
    createComponent(name: string, views: { [index: string]: string }, data: Object | store, actions: object, injections: object = {}, translations : object = {}) {
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

        let _t = (text:string, lang?:string) => internationalize._t(text, lang);

        if (typeof views?.[name] === "function") {

            el.innerHTML = views?.[name]?.apply(s, [{ value: "" }, ...storeArray, _t ]);
        } else {
            el.innerHTML = views?.[name];
        } 

        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;
        el.setAttribute("data-name", name);

        this.components[name] = new component(ddom, s, actions);
        
        console.log("COMPOS", this.components[name].loadStores());

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

}