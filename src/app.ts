import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';
import { i18n } from './i18n.js';

export class app {
    public dataH: dataHandler;
    public components: { [index: string]: component } = {};
    public sharedComponents: { [index: string]: component } = {};
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
                data,
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
    createComponent(name: string, data: Object | store, componentObject: object) {

        let componentID: string = name.split("#").length > 1 ? name.split("#")[1] : name;
        name = name.split("#").length > 1 ? name.split("#")[0] : name;

        data = (typeof data === "undefined" || typeof data.then === "function" ) ? this.dataH.createStore(name, {}) : data;

        if(!(data instanceof store)) data = this.dataH.createStore(name, data);
        let el = document.createElement("component");
        let internationalize = new i18n();
        internationalize.addTranslation(componentObject.translations);

        el.setAttribute("data-name", name);

        for(let name in componentObject.components){
            if( typeof componentObject.components[name] === "string" ){
                let nameID = componentObject.components[name].split("#").length > 0 ? componentObject.components[name].split("#")[1]: componentObject.components[name];
                componentObject.components[name] = this.components[nameID];
            }
        }

        let ddom = new dom(el, componentObject.components, data, componentObject?.views, internationalize);
        ddom.name = name;
         
        this.components[componentID] = ddom.createComponent(name, el, componentObject);
        
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