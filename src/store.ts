export * from './dataHandler.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import * as fjp from 'fast-json-patch';

export class store {

    private _data: { [index: string]: Object } = {};
    public events: eventHandler | undefined;
    private dataH: dataHandler | undefined;
    public component : string;
    private patchQueue: Array<fjp.Operation> = [];

    constructor(eventH: eventHandler, dataH: dataHandler, component: string, data: Object) {
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.createStore(component, data);
    }

    createStore(component: string, data: Object) {
 
         let createProxy = (data: Object, parentPath: string = "") =>{
            const handler = {
                get: (oTarget, key): any => { 
                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
                        let px:string = parentPath + "/" + key;
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
                    let op : string = typeof oTarget[sKey] ==="undefined" ? "add" : "replace";
                    let diff: fjp.Operation = { op, path :  parentPath + "/" + sKey, value: vValue };
                    oTarget[sKey] = vValue;

                    /**
                     * @todo set value and use this.pxy[px] for $ connected values 
                     */ 

                    
                     /**
                      * collect diffs inside handler and bubble later on
                      */
                    this.changeStore(component, diff);

                    return true;
                },
                deleteProperty: (oTarget, sKey) => {
                    console.log("delete", oTarget[sKey]);
                    delete oTarget[sKey];
                    this.changeStore(component, { op : "remove", path :  parentPath + "/" + sKey});
                    return true;
                },
                defineProperty: (oTarget, sKey, oDesc) => {
                    if (oDesc && "value" in oDesc) { oTarget[sKey] = oDesc.value }
                    return oTarget;
                }
            };

            return new Proxy(data, handler);
        }

        this._data = createProxy(fjp.default.deepClone(data));

    }

    /**
     * collect all changes then bubble event after ...what is important?
     * @param component 
     * @param changes 
     */
    changeStore(component: string, change: fjp.Operation){
        console.log("store ", component, change);

        this.patchQueue.push(change);

       /* 
      this.events.addEvent(component, change.path, change.op, function(change){
        console.log("hallo welt");
      });
*/
      this.events?.dispatchEvent(component, change.path, change.op, change);
      this.events?.dispatchEvent(component, component, "change", change);
    }


    get data() {
        return this._data;
    }

    set(path:string, value:any){

    } 
 
}