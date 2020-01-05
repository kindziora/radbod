export * from './dataHandler.js';
export class store {
    constructor(eventH, dataH) {
        this.data = {};
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
                console.log(oTarget, sKey, vValue);
                return true;
            },
            deleteProperty: (oTarget, sKey) => {
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
        this.data = new Proxy(deepClone(data), handler);
    }
    changeStore(changes) {
    }
}
