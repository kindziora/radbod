export * from './dataHandler.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';

export class store {

    public data: { [index: string]: Object } = {};
    private events: eventHandler | undefined;
    private dataH: dataHandler| undefined;
    private pxy: { [index: string]: ProxyConstructor } = {};


    constructor(eventH?: eventHandler, dataH?: dataHandler) {
        this.events = eventH;
        this.dataH = dataH;
    }

    createStore(component: string, data: Object) {
        
        const handler = {
            get: (oTarget, key):any => {
                if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
                    this.pxy[key] = this.pxy[key] || new Proxy(oTarget[key], handler);
                    return this.pxy[key];
                  } else {
                    return oTarget[key];
                  }
             },
            set: (oTarget, sKey, vValue) => {
                oTarget[sKey] = vValue;
                console.log(oTarget, sKey, vValue);
                return true;
            },
            deleteProperty: (oTarget, sKey) => {
                 delete oTarget[sKey];
                 return true;
            },
            defineProperty: (oTarget, sKey, oDesc) => {
                if (oDesc && "value" in oDesc) { oTarget[sKey] = oDesc.value }
                return oTarget;
            }
        };
        
        this.data = new Proxy(deepClone(data), handler);

    }

    changeStore(changes: Array<op>) {

    }
}