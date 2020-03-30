export * from './dataHandler.js';
export class store {
    constructor(eventH, dataH, component, data) {
        this._data = {};
        this.patchQueue = [];
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.name = component;
        this.createStore(component, data);
    }
    unmaskComponentName(component) {
        return component.charAt(0) === "$" ? component.substr(1) : component;
    }
    createStore(component, data) {
        let createProxy = (data, parentPath = `/$${component}`) => {
            const handler = {
                get: (oTarget, key) => {
                    var _a, _b, _c;
                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null || typeof oTarget[key] === 'function') {
                        let px = parentPath + "/" + key;
                        if (key.charAt(0) === "$") { //reference
                            px = key;
                        }
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
                    /**
                     * @todo set value and use this.pxy[px] for $ connected values
                     */
                    if (oTarget[sKey] !== vValue) {
                        oTarget[sKey] = vValue;
                        let tmpChain = this.changeStore(component, diff);
                    }
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
        if (typeof data !== "object") {
            console.log("store data is not an object", typeof data, data);
            data = {};
        }
        //  if(typeof this.dataH.pxy[`$${component}`] === "undefined"){
        this.dataH.pxy[`$${component}`] = this._data = createProxy(data); //fjp.default.deepClone(data);
        // }else{
        //      Object.assign(this.dataH.pxy[`$${component}`], data);
        // }
        return this;
    }
    /**
     * collect all changes then bubble event after ...what is important?
     * @param component
     * @param changes
     */
    changeStore(component, change) {
        var _a, _b, _c;
        let ret = null;
        this.patchQueue.push(change);
        let retChange = (_a = this.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(component, "/", "change", [change], this.data);
        //console.log(component, "/", "change", change);
        try {
            ret = (_b = this.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(component, change.path, "change", [change], this.data);
            ret = (_c = this.events) === null || _c === void 0 ? void 0 : _c.dispatchEvent(component, change.path, change.op, [change], this.data, ret);
        }
        catch (e) {
            ret = retChange;
        }
        return ret;
    }
    get data() {
        return this._data;
    }
    db() {
        return this._storage;
    }
    setDb(db) {
        return this._storage = db;
    }
    load(selector, cb) {
        if (this.db()) {
            return new Promise((resolve, reject) => this.db().find(selector, (data) => {
                if (typeof data === "object")
                    this.createStore(this.name, data);
                cb.call(this.dataH, data);
                resolve(data);
            }));
        }
        else {
            return this.data;
        }
    }
}
