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

    private replaceFunctionHeader(funcString : string, newFunctionHeader : string){
        const functionHeader = /\([\w,\s]+\)+(\s+|)=>/m;
       return funcString.replace(functionHeader, `(${newFunctionHeader})=>`);
    }

    /**
     * 
     * @param name 
     * @param componentObject 
     * @param callback 
     */
    mountComponent(name: string, componentObject: Object, callback: Function) {
        
        console.log(`mount component: ${name}`, this.loadStores(componentObject, (stores, data) => {
        
            let compo = this.createComponent(name, 
                componentObject.views,
                componentObject.data.call(this.dataH, function(data) {
                    console.log(`DATA MAIN COMPONENT ${name}`, data);
                }),
                componentObject.interactions, 
                componentObject.components, 
                componentObject.translations(),
                componentObject
            );
             
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
    createComponent(name: string, views: { [index: string]: string }, data: Object | store, actions: object, injections: object = {}, translations: object = {}, componentObject?:object, style?:object) {
        let s;

        if (data instanceof store) {
            s = data;
        } else {
            s = this.dataH.createStore(name, data);
        }
        
        let el = document.createElement("component");
        let storeObject = this.dataH?.store.toObject();

        let internationalize = new i18n();
        internationalize.addTranslation(translations);

        let _t = (text: string, lang?: string) => internationalize._t(text, lang);

        if (typeof views?.[name] === "function") {

            el.innerHTML = views?.[name]?.call(this, {change:{ value: "" }, ...storeObject, _t});

        } else {
            el.innerHTML = views?.[name];
        }
        
        el.setAttribute("data-name", name);
        
        if(componentObject?.style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = componentObject.style;
            el.append(stEl);
        }

        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;

      
        let act = {};
        try{
            act = actions.call({componentObject, dom: ddom});
        }catch(e) {
            console.log(e);
        }
        

        this.components[name] = new component(ddom, s, act);

        if (typeof views?.[name] !== "function") {
            let args = this.dataH?.store.keys()?.join(','); 
            this.components[name].dom.setTemplate(eval('(function(args){ let {change, ' + args +', _t} = args; return `' + this.components[name].dom._area.innerHTML + '`})'));
        } else {
            this.components[name].dom.setTemplate(views?.[name]);
        }

        if(typeof componentObject?.mounted === "function" && typeof views?.[name] === "function"){
            componentObject?.mounted.call(this.components[name]);
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
                cb(data, component);
                meta.cnt++;
                meta.loaded.push(component);
                if (meta.cnt >= total) {
                    allready(dataH, meta);
                }
            }
        };

        let result = component.data.call(this.dataH, callback(meta, this.dataH), {});

        if (!result || typeof result.then !== "function") {
            callback(meta, this.dataH)(result);
        }

        for (let i in component.components) {
            this.fetchData(component.components[i], cb, allready, total, meta);
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

        this.fetchData(componentObject, (data, component) => {
             console.log("fetchData: ", data.name, data);
             component.environment = this.environment;
             component?.loaded?.call(component, data);
        }, cb, count, met, this.dataH);
    }

}