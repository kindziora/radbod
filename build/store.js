export * from './dataHandler.js';
var validationMode;
(function (validationMode) {
    validationMode[validationMode["fifo"] = 0] = "fifo";
    validationMode[validationMode["all"] = 0] = "all";
})(validationMode || (validationMode = {}));
export class meta {
    constructor(eventH) {
        this._meta = {};
        this._state = {};
        this.events = eventH;
    }
    getStates() {
        return this._state;
    }
    getMeta(fieldPath) {
        var _a;
        return (_a = this._meta[this.normalizeFieldpath(fieldPath)]) !== null && _a !== void 0 ? _a : { validationMode: validationMode.all, validators: {} };
    }
    setMeta(fieldPath, value) {
        var _a;
        value.validationMode = (_a = value === null || value === void 0 ? void 0 : value.validationMode) !== null && _a !== void 0 ? _a : validationMode.all;
        this._meta[this.normalizeFieldpath(fieldPath)] = value;
    }
    normalizeFieldpath(fieldPath) {
        return fieldPath.replace("/_state", "");
    }
    getState(fieldPath) {
        var _a;
        return (_a = this._state[this.normalizeFieldpath(fieldPath)]) !== null && _a !== void 0 ? _a : { isValid: true, msg: [] };
    }
    setState(fieldPath, info) {
        var _a, _b, _c, _d, _e, _f, _g;
        fieldPath = this.normalizeFieldpath(fieldPath);
        let validChanged = ((_a = this._state[fieldPath]) === null || _a === void 0 ? void 0 : _a.isValid) !== info.isValid;
        let msgChanged = ((_b = this._state[fieldPath]) === null || _b === void 0 ? void 0 : _b.msg) !== info.msg;
        if (validChanged || msgChanged) {
            this._state[fieldPath] = info;
            (_c = this.events) === null || _c === void 0 ? void 0 : _c.dispatchEvent("_state", "/_state" + fieldPath, "change", [{ op: "replace", path: "/_state" + fieldPath, value: info }], info);
            if (validChanged) {
                (_d = this.events) === null || _d === void 0 ? void 0 : _d.dispatchEvent("_state", "/_state" + fieldPath + "/isValid", "change", [{ op: "replace", path: "/_state" + fieldPath + "/isValid", value: info.isValid }], info);
                (_e = this.events) === null || _e === void 0 ? void 0 : _e.dispatchEvent("_state", "/", "change", [{ op: "replace", path: "/_state" + fieldPath + "/isValid", value: info.isValid }], info);
            }
            if (msgChanged) {
                (_f = this.events) === null || _f === void 0 ? void 0 : _f.dispatchEvent("_state", "/_state" + fieldPath + "/msg", "change", [{ op: "replace", path: "/_state" + fieldPath + "/msg", value: info.msg }], info);
                (_g = this.events) === null || _g === void 0 ? void 0 : _g.dispatchEvent("_state", "/_state", "change", [{ op: "replace", path: "/_state" + fieldPath + "/msg", value: info.msg }], info);
            }
        }
    }
}
export class store {
    constructor(eventH, dataH, component, data) {
        var _a;
        this._data = {};
        this.patchQueue = [];
        this._validations = {};
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.name = component;
        this.createStore(component, data);
        this.setDb((_a = this.dataH) === null || _a === void 0 ? void 0 : _a.environment);
    }
    unmaskComponentName(component, char = "$") {
        return component.charAt(0) === char ? component.substr(1) : component;
    }
    accessByPath(path) {
        if (path.indexOf("_state") !== -1) {
            return this._meta.getState(path);
        }
        let properties = Array.isArray(path) ? path : this.unmaskComponentName(path, "/").split("/");
        return properties.reduce((prev, curr) => prev && prev[curr], this.dataH.pxy);
    }
    getMetaState() {
        return this._meta;
    }
    /**
     *
     * @returns
     */
    validateAllFields() {
        return this.validateFields(Object.keys(this.getMetaState().getStates()));
    }
    /**
     *
     * @param fields
     * @returns
     */
    validateFields(fields = []) {
        let states = [];
        for (let i in fields) {
            let val = typeof this.accessByPath(fields[i]) !== "undefined" ? this.accessByPath(fields[i]) : "";
            states[fields[i]] = this.validateField(fields[i], val);
        }
        return states;
    }
    /**
     *
     * @param fieldPath
     * @param value
     * @returns
     */
    validateField(fieldPath, value) {
        let metaData = this.getMetaState().getMeta(fieldPath);
        let stateData = { isValid: true, msg: [] };
        if (metaData === null || metaData === void 0 ? void 0 : metaData.validators) {
            for (let v in metaData.validators) {
                let result = metaData.validators[v](value);
                if (!result.isValid) {
                    stateData.msg.push(result.msg);
                    stateData.isValid = false;
                }
            }
        }
        this._meta.setState(fieldPath, stateData);
        return stateData;
    }
    createStore(component, data) {
        let createProxy = (data, parentPath = `/$${component}`) => {
            const handler = {
                get: (oTarget, key) => {
                    var _a, _b, _c;
                    if (typeof oTarget[key] === 'function')
                        return oTarget[key];
                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {
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
                     * @todo TESTSTAGE set value and use this.pxy[px] for $ connected values
                     */
                    let result = this.validateField(diff.path, vValue);
                    if (typeof vValue === 'object') {
                        if (diff.path.charAt(0) === "$") { //reference
                            diff.path = sKey;
                        }
                    }
                    if (oTarget[sKey] !== vValue || (typeof vValue === 'object' && this.dataH.pxy[diff.path] !== vValue)) {
                        if (result.isValid) {
                            oTarget[sKey] = vValue;
                            if (typeof vValue === 'object')
                                this.dataH.pxy[diff.path] = vValue;
                            let tmpChain = this.changeStore(component, diff);
                        }
                        else {
                            /*  return false; */
                        }
                    }
                    return true;
                },
                deleteProperty: (oTarget, sKey) => {
                    console.log("delete", oTarget[sKey]);
                    let result = this.validateField(parentPath + "/" + sKey, null);
                    if (result.isValid) {
                        delete oTarget[sKey];
                        this.changeStore(component, { op: "remove", path: parentPath + "/" + sKey, value: undefined });
                    }
                    else {
                        /*  return false; */
                    }
                    return true;
                },
                defineProperty: (oTarget, sKey, oDesc) => {
                    console.log("DEFINE", oTarget[sKey]);
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
        //create meta here and set prefix path
        this._meta = new meta(this.events);
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
        if (this.patchQueue.length > 100)
            this.patchQueue.shift();
        let retChange = (_a = this.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(component, "/" + `$${component}`, "change", [change], this.data);
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
        this._storage = new Proxy(db, {
            get: (target, name) => {
                if (target[name] && typeof target[name] === "function") {
                    return new Proxy(target[name], {
                        apply: (targetFnc, thisArg, argumentsList) => {
                            return targetFnc.apply(thisArg, [...argumentsList, this]);
                        }
                    });
                    // return () => target[name].call(...arguments, this);
                }
                return target[name];
            }
        });
        return this;
    }
    setValidations(validations) {
        this._validations = validations;
        return this;
    }
    addValidations(validations) {
        validations = validations != null && validations.constructor.name === "Object" ? validations : {};
        this._validations = Object.assign(this._validations, validations);
        return this;
    }
    getValidations() {
        return this._validations;
    }
}
