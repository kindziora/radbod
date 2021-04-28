export * from './dataHandler.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler, op, validationResult } from './dataHandler.js';

type state = {
    isValid: boolean,
    msg: Array<string>
}

enum validationMode {
    fifo = 0,
    all = 0
}

type _metaData = {
    validationMode: validationMode,
    validators: { [index: string]: Function }
}

export class meta {

    private _meta: { [index: string]: _metaData } = {};

    private _state: { [index: string]: state } = {};

    public events: eventHandler | undefined;

    constructor(eventH: eventHandler) {
        this.events = eventH;
    }

    getStates() {
        return this._state;
    }

    getMeta(fieldPath: string): _metaData {
        return this._meta[this.normalizeFieldpath(fieldPath)] ?? { validationMode: validationMode.all, validators: {} };
    }

    setMeta(fieldPath: string, value: _metaData) {
        value.validationMode = value?.validationMode ?? validationMode.all;

        this._meta[this.normalizeFieldpath(fieldPath)] = value;
    }

    normalizeFieldpath(fieldPath: string) {
        return fieldPath.replace("/_state", "");
    }
    getState(fieldPath: string): state {
        return this._state[this.normalizeFieldpath(fieldPath)] ?? { isValid: true, msg: [] };
    }

    setState(fieldPath: string, info: state) {
        fieldPath = this.normalizeFieldpath(fieldPath);
        let validChanged = this._state[fieldPath]?.isValid !== info.isValid;
        let msgChanged = this._state[fieldPath]?.msg !== info.msg;

        if (validChanged || msgChanged) {
            this._state[fieldPath] = info;
            this.events?.dispatchEvent("_state", "/_state" + fieldPath, "change", [{ op: "replace", path: "/_state" + fieldPath, value: info }], info);

            if (validChanged) {
                this.events?.dispatchEvent("_state", "/_state" + fieldPath + "/isValid", "change", [{ op: "replace", path: "/_state" + fieldPath + "/isValid", value: info.isValid }], info);
                this.events?.dispatchEvent("_state", "/", "change", [{ op: "replace", path: "/_state" + fieldPath + "/isValid", value: info.isValid }], info);
            }
            if (msgChanged) {
                this.events?.dispatchEvent("_state", "/_state" + fieldPath + "/msg", "change", [{ op: "replace", path: "/_state" + fieldPath + "/msg", value: info.msg }], info);
                this.events?.dispatchEvent("_state", "/_state", "change", [{ op: "replace", path: "/_state" + fieldPath + "/msg", value: info.msg }], info);
            }


        }

    }

}

export class store {

    private _data: { [index: string]: Object } = {};
    public events: eventHandler | undefined;
    public dataH: dataHandler | undefined;
    public component: string;
    public name: string;
    private patchQueue: Array<op> = [];

    public schema: string;
    
    private _validations: { [index: string]: Object } = {};
    private _meta: meta;

    private _storage: Object;

    constructor(eventH: eventHandler, dataH: dataHandler, component: string, data: Object) {
        this.events = eventH;
        this.dataH = dataH;
        this.component = component;
        this.name = component;
        this.createStore(component, data);
        this.setDb(this.dataH?.environment);
    }

    unmaskComponentName(component: string, char: string = "$") {
        return component.charAt(0) === char ? component.substr(1) : component;
    }

    accessByPath(path: string) {

        if (path.indexOf("_state") !== -1) {
            return this._meta.getState(path);
        }

        let properties = Array.isArray(path) ? path : this.unmaskComponentName(path, "/").split("/");
        return properties.reduce((prev: any, curr: any) => prev && prev[curr], this.dataH.pxy)
    }

    getMetaState(): meta {
        return this._meta;
    }

    /**
     * 
     * @returns 
     */
    validateAllFields(): { [index: string]: state } {
        return this.validateFields(Object.keys(this.getMetaState().getStates()));
    }

    /**
     * 
     * @param fields 
     * @returns 
     */
    validateFields(fields: string[] = []): { [index: string]: state } {
        let states : { [index: string]: state } = [];
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
    validateField(fieldPath: string, value: any): state {
        let metaData: _metaData = this.getMetaState().getMeta(fieldPath);
        let stateData: state = { isValid: true, msg: [] };

        if (metaData?.validators) {
            for (let v in metaData.validators) {
                let result: state = metaData.validators[v](value);
                if (!result.isValid) {
                    stateData.msg.push(result.msg);
                    stateData.isValid = false;
                }
            }
        }

        this._meta.setState(fieldPath, stateData);

        return stateData;
    }

    createStore(component: string, data: Object) {

        let createProxy = (data: Object, parentPath: string = `/$${component}`) => {
            const handler = {
                get: (oTarget: any, key: string): any => {
                    if (typeof oTarget[key] === 'function') return oTarget[key];

                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null) {

                        let px: string = parentPath + "/" + key;

                        if (key.charAt(0) === "$") { //reference
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
                set: (oTarget: any, sKey: string, vValue: any) => {
                    let op: string = typeof oTarget[sKey] === "undefined" ? "add" : "replace";
                    let diff: op = { op, path: parentPath + "/" + sKey, value: vValue };

                    /**
                     * @todo TESTSTAGE set value and use this.pxy[px] for $ connected values 
                     */
   
                    let result: state = this.validateField(diff.path, vValue);
                     
                    if (typeof vValue === 'object') { 
                        if (diff.path.charAt(0) === "$") { //reference
                            diff.path = sKey;
                        } 
                    }

                    if (oTarget[sKey] !== vValue || (typeof vValue === 'object' && this.dataH.pxy[diff.path] !== vValue)) {

                        if(typeof vValue === 'object'){
                            if (JSON.stringify(oTarget[sKey]) === JSON.stringify(vValue)) return true;
                        }

                        if (result.isValid) {
                            oTarget[sKey] = vValue;
                            if(typeof vValue === 'object')
                                this.dataH.pxy[diff.path] = vValue;
                            let tmpChain = this.changeStore(component, diff);
                        } else {
                            /*  return false; */
                        }

                    }

                    return true;
                },
                deleteProperty: (oTarget: any, sKey: string) => {
                    console.log("delete", oTarget[sKey]);

                    let result: state = this.validateField(parentPath + "/" + sKey, null);
                    if (result.isValid) {
                        delete oTarget[sKey];
                        this.changeStore(component, { op: "remove", path: parentPath + "/" + sKey, value: undefined });
                    } else {
                        /*  return false; */
                    }

                    return true;
                },
                defineProperty: (oTarget: any, sKey: string, oDesc: any) => {
                    console.log("DEFINE", oTarget[sKey]);

                    if (oDesc && "value" in oDesc) {
                        oTarget[sKey] = oDesc.value;
                    }

                    return oTarget;
                }

            };
            
            return new Proxy(data, handler);
        }

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
    changeStore(component: string, change: op) {
        let ret = null;
        this.patchQueue.push(change);

        if (this.patchQueue.length > 100) this.patchQueue.shift();

        let retChange = this.events?.dispatchEvent(component, "/" + `$${component}`, "change", [change], this.data);
        //console.log(component, "/", "change", change);

        try {
            ret = this.events?.dispatchEvent(component, change.path, "change", [change], this.data);
            ret = this.events?.dispatchEvent(component, change.path, change.op, [change], this.data, ret);
        } catch (e) {
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

    setDb(db: object) { 
 
        this._storage = new Proxy(db, {
          get:(target, name) => {
            if(target[name] && typeof target[name] ==="function") {
 
                 return new Proxy(target[name], {
                    apply: (targetFnc, thisArg, argumentsList) =>{
                     
                      return targetFnc.apply(thisArg, [...argumentsList,this]);
                    }
                  });


                // return () => target[name].call(...arguments, this);
            }

           return target[name];
            
          }
        });

        
        return this;
    }

    setValidations(validations: { [index: string]: Object }) {
        this._validations = validations;
        return this;
    }

    addValidations(validations: { [index: string]: Object }) {

        validations = validations != null && validations.constructor.name === "Object" ? validations : {};

        this._validations = Object.assign(this._validations, validations);

        return this;
    }

    getValidations() {
        return this._validations;
    }
  
}