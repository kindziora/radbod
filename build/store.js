export * from './dataHandler.js';
import * as fjp from 'fast-json-patch';
export const step = (sub, pre = "", paths) => {
    if (pre !== "")
        paths.push(pre);
    for (let i in sub) {
        if (typeof sub[i] === "object") {
            step(sub[i], pre + "/" + i, paths);
        }
        else {
            paths.push(pre + "/" + i);
        }
    }
    return paths;
};
export class store {
    constructor(eventH, dataH, component, data) {
        this._data = {};
        this.pxy = {};
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.createStore(component, data);
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
                var _a;
                let pre = fjp.default.deepClone(this._data);
                oTarget[sKey] = vValue;
                console.log("set", this.component, oTarget, sKey, vValue);
                let diff = fjp.compare(fjp.default.deepClone(this._data), pre);
                (_a = this.dataH) === null || _a === void 0 ? void 0 : _a.changeStore(component, diff);
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
    getPaths() {
        return step(this._data, "", []);
    }
}
