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

    private replaceFunctionHeader(funcString: string, newFunctionHeader: string) {
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

        console.log(`mount component: ${name}`, this.loadStores(componentObject, (stores, meta, data) => {

            let compo = this.createComponent(name,
                componentObject.views,
                data,
                componentObject.interactions,
                componentObject.components,
                typeof componentObject?.translations ==="function" ? componentObject.translations(): componentObject?.translations,
                componentObject
            );

            callback(stores, meta, compo);

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
    createComponent(name: string, views: { [index: string]: Function }, data: Object | store, actions: object, injections: object = {}, translations: object = {}, componentObject?: object, style?: object) {
        let s: store;
        let componentID: string = name.split("#").length > 1 ? name.split("#")[1] : name;
        name = name.split("#").length > 1 ? name.split("#")[0] : name;

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

            el.innerHTML = views?.[name]?.call(this, { change: { value: "" }, ...storeObject, _t });

        } else {
            el.innerHTML = views?.[name];
        }

        el.setAttribute("data-name", name);

        if (componentObject?.style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = componentObject.style;
            el.append(stEl);
        }

        for(let name in injections){
            if( typeof injections[name] === "string" ){
                let nameID = injections[name].split("#").length > 0 ? injections[name].split("#")[1]: injections[name];
                injections[name] = this.components[nameID];
            }
        }

        let ddom = new dom(el, injections, s, views, _t);
        ddom.name = name;


        let act = {};
        try {
            act = actions.call({ componentObject, dom: ddom });
        } catch (e) {
            console.log(e);
        }


        this.components[componentID] = new component(ddom, s, act);

        if (typeof views?.[name] !== "function") {
            let args = this.dataH?.store.keys()?.join(',');
            this.components[componentID].dom.setTemplate(eval('(function(args){ let {change, ' + args + ', _t} = args; return `' + this.components[componentID].dom._area.innerHTML + '`})'));
        } else {
            this.components[componentID].dom.setTemplate(views?.[name]);
        }

        if (typeof componentObject?.mounted === "function" && typeof views?.[name] === "function") {
            componentObject?.mounted.call(this.components[componentID]);
        }

        return this.components[componentID];
    }

    /**
     * 
     * @param componentID 
     */
    removeComponent(componentID: string) {
        delete this.components[componentID];
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
                    allready(dataH, meta, data);
                }
            }
        };

        if( typeof component === "string" ){
            let nameID = component.split("#").length > 0 ? component.split("#")[1]: component;
            component = this.components[nameID];
            //what now?
        }else{
            if(component.data) { 
                let result = component.data.call(this.dataH, callback(meta, this.dataH), {});

                if (!result || typeof result.then !== "function") {
                    callback(meta, this.dataH)(result);
                }
        
                for (let i in component.components) {
                    this.fetchData(component.components[i], cb, allready, total, meta);
                }
            }
           
        }
        
    }

    private countForData(component: object, cnt: number) {
        for (let i in component.components){
            if(typeof component.components[i] !=="string")
                cnt = this.countForData(component.components[i], cnt);
        }
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