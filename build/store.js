export * from './dataHandler.js';
import * as fjp from 'fast-json-patch';
export class store {
    constructor(eventH, dataH, component, data) {
        this._data = {};
        this.patchQueue = [];
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.createStore(component, data);
    }
    createStore(component, data) {
        let createProxy = (data, parentPath = "") => {
            const handler = {
                get: (oTarget, key) => {
                    var _a, _b, _c;
                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
                        let px = parentPath + "/" + key;
                        this.dataH.pxy[px] = ((_a = this.dataH) === null || _a === void 0 ? void 0 : _a.pxy[px]) || createProxy(oTarget[key], px);
                        return (_c = (_b = this.dataH) === null || _b === void 0 ? void 0 : _b.pxy) === null || _c === void 0 ? void 0 : _c[px];
                    }
                    else {
                        return oTarget[key];
                    }
                    /**
                     * @todo get value and use this.pxy[px] for $ connected values
                     */
                },
                set: (oTarget, sKey, vValue) => {
                    let op = typeof oTarget[sKey] === "undefined" ? "add" : "replace";
                    let diff = { op, path: parentPath + "/" + sKey, value: vValue };
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
                    this.changeStore(component, { op: "remove", path: parentPath + "/" + sKey });
                    return true;
                },
                defineProperty: (oTarget, sKey, oDesc) => {
                    if (oDesc && "value" in oDesc) {
                        oTarget[sKey] = oDesc.value;
                    }
                    return oTarget;
                }
            };
            return new Proxy(data, handler);
        };
        this._data = createProxy(fjp.default.deepClone(data));
    }
    /**
     * collect all changes then bubble event after ...what is important?
     * @param component
     * @param changes
     */
    changeStore(component, change) {
        var _a, _b;
        console.log("store ", component, change);
        this.patchQueue.push(change);
        /*
       this.events.addEvent(component, change.path, change.op, function(change){
         console.log("hallo welt");
       });
 */
        (_a = this.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(component, change.path, change.op, change);
        (_b = this.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(component, component, "change", change);
    }
    get data() {
        return this._data;
    }
    set(path, value) {
    }
}
