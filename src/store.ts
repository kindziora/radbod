export * from './dataHandler.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler, op } from './dataHandler.js';

export class store {

    private _data: { [index: string]: Object } = {};
    public events: eventHandler | undefined;
    public dataH: dataHandler | undefined;
    public component: string;
    public name: string;
    private patchQueue: Array<op> = [];

    private _storage: Object;

    constructor(eventH: eventHandler, dataH: dataHandler, component: string, data: Object) {
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.name = component;
        this.createStore(component, data);
    }

    unmaskComponentName(component: string) {
        return component.charAt(0) === "$" ? component.substr(1) : component;
    }

    createStore(component: string, data: Object) {

        let createProxy = (data: Object, parentPath: string = `/$${component}`) => {
            const handler = {
                get: (oTarget, key): any => {

                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null || typeof oTarget[key] === 'function' ) {
                        
                        let px: string = parentPath + "/" + key;
                       
                        if(key.charAt(0) === "$"){ //reference
                            px = key;
                        }
 
                        this.dataH.pxy[px] = this.dataH?.pxy[px] || createProxy(oTarget[key], px);
                        
                        return this.dataH?.pxy?.[px];
                    } else {
                        return oTarget[key];
                    }

                    /**
                     * @todo get value and use this.pxy[px] for $ connected values 
                     */

                },
                set: (oTarget, sKey, vValue) => {
                    let op: string = typeof oTarget[sKey] === "undefined" ? "add" : "replace";
                    let diff: op = { op, path: parentPath + "/" + sKey, value: vValue };

                    /**
                     * @todo set value and use this.pxy[px] for $ connected values 
                     */

                    if (oTarget[sKey] !== vValue) {
                        let tmpChain = this.changeStore(component, diff); 
                    }
                     
                    oTarget[sKey] = vValue; 

                    return true;
                },
                deleteProperty: (oTarget, sKey) => {
                    console.log("delete", oTarget[sKey]);
                    delete oTarget[sKey];
                    this.changeStore(component, { op: "remove", path: parentPath + "/" + sKey });
                    return true;
                },
                defineProperty: (oTarget, sKey, oDesc) => {
                    if (oDesc && "value" in oDesc) { oTarget[sKey] = oDesc.value }
                    return oTarget;
                }
                
            };

            return new Proxy(data, handler);
        }

        if(typeof data !=="object"){

            console.log("store data is not an object", typeof data, data);
            
            data = {};
        }

        this.dataH.pxy[`$${component}`] = this._data = createProxy(data); //fjp.default.deepClone(data);
        

        return this;
    }

    /**
     * collect all changes then bubble event after ...what is important?
     * @param component 
     * @param changes 
     */
    changeStore(component: string, change: op) {
        let ret = null;
        this.patchQueue.push(change);
        
        let retChange = this.events?.dispatchEvent(component, "/", "change", [change], this.data);
        //console.log(component, "/", "change", change);

        try{
            ret = this.events?.dispatchEvent(component, change.path, "change", [change], this.data);
            ret = this.events?.dispatchEvent(component, change.path, change.op, [change], this.data, ret);
        }catch(e){
            ret = retChange;
        }
       
        return ret;
    }

    get data() {
        return this._data;
    }

    db(){
        return this._storage;
    }

    setDb(db : object){
        return this._storage = db;
    }
    
    load(selector: Object, cb : Function){
        if(this.db()){
           return new Promise((resolve, reject) =>  this.db().find(selector, (data) => {
                if(typeof data ==="object")
                    this.createStore(this.name, data);
                cb.call(this.dataH, data);
                resolve(data);
            }));
        }
    }
    
}