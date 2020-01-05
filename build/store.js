export * from './dataHandler.js';
import * as fjp from 'fast-json-patch';
export class store {
    constructor(eventH, dataH) {
        this._data = {};
        this.pxy = {};
        this.events = eventH;
        this.dataH = dataH;
    }
    createStore(component, data) {
        const handler = {
            get: (oTarget, key) => {
                if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
                    this.pxy[key] = this.pxy[key] || new Proxy(oTarget[key], handler);
                    return this.pxy[key];
                }
                else {
                    return oTarget[key];
                }
            },
            set: (oTarget, sKey, vValue) => {
                oTarget[sKey] = vValue;
                console.log("set", oTarget, sKey, vValue);
                return true;
            },
            deleteProperty: (oTarget, sKey) => {
                console.log("delete", oTarget[sKey]);
                delete oTarget[sKey];
                return true;
            },
            defineProperty: (oTarget, sKey, oDesc) => {
                if (oDesc && "value" in oDesc) {
                    oTarget[sKey] = oDesc.value;
                }
                return oTarget;
            }
        };
        this._data = new Proxy(fjp.default.deepClone(data), handler);
    }
    get data() {
        return this._data;
    }
    changeStore(changes) {
    }
}
