export * from './dataHandler.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import * as fjp from 'fast-json-patch';

export const step = (sub, pre = "", paths) => {
    if (pre !== "")
        paths.push(pre);
    for (let i in sub) {
        if (typeof sub[i] === "object") {
            step(sub[i], pre + "/" + i, paths);
        } else {
            paths.push(pre + "/" + i);
        }
    }
    return paths;
};

export class store {

    private _data: { [index: string]: Object } = {};
    private events: eventHandler | undefined;
    private dataH: dataHandler | undefined;
    private pxy: { [index: string]: ProxyConstructor } = {};
    public component : string;

    constructor(eventH: eventHandler, dataH: dataHandler, component: string, data: Object) {
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.createStore(component, data);
    }

    createStore(component: string, data: Object) {

        const handler = {
            get: (oTarget, key): any => {
                if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
                    this.pxy[key] = this.pxy[key] || new Proxy(oTarget[key], handler);
                    return this.pxy[key];
                } else {
                    return oTarget[key];
                }
            },
            set: (oTarget, sKey, vValue) => { 
                let pre = fjp.default.deepClone(this._data)
                oTarget[sKey] = vValue;
                console.log("set", this.component, oTarget, sKey, vValue);
                let diff = fjp.default.compare(fjp.default.deepClone(this._data), pre);
                this.dataH?.changeStore(component, diff);
                return true;
            },
            deleteProperty: (oTarget, sKey) => {
                console.log("delete", oTarget[sKey]);
                delete oTarget[sKey];
                return true;
            },
            defineProperty: (oTarget, sKey, oDesc) => {
                if (oDesc && "value" in oDesc) { oTarget[sKey] = oDesc.value }
                return oTarget;
            }
        };

        this._data = new Proxy(fjp.default.deepClone(data), handler);

    }

    get data() {
        return this._data;
    }

    changeStore(changes: Array<op>) {

    }

    getPaths() {
        return step(this._data, "", []);
    }
}