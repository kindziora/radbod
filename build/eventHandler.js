/**
 *
 * @param str
 * @param seed
 */
export const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
;
export class eventHandler {
    constructor() {
        this.event = {};
        this.eventById = {};
    }
    construct() {
    }
    /**
     *
     * @param cb
     */
    addFunction(cb, meta, context) {
        let id = cyrb53(cb.toString()) + "_" + meta.component;
        /*
        this.eventById[id] = ((meta, eventHdlr) => (args:object = {}, returnValue = null) =>{
            return cb(args, returnValue, meta);
        })(meta, this);
*/
        this.eventById[id] = cb.bind(context || this);
        return id;
    }
    getFunction(id) {
        return this.eventById[id];
    }
    removeEvent(callbackId) {
        delete this.eventById[callbackId];
        //todo: cleanup named object
    }
    /**
     *
     * @param component
     * @param id
     * @param name
     * @param cb
     */
    addEvent(component, id, name, cb, context) {
        if (typeof cb !== "function")
            return;
        let callbackId = this.addFunction(cb, { component, id, name }, context);
        if (typeof this.event[component] === "undefined") {
            this.event[component] = {};
        }
        if (typeof this.event[component][id] === "undefined") {
            this.event[component][id] = {};
        }
        if (typeof this.event[component][id][name] === "undefined") {
            this.event[component][id][name] = [];
        }
        if (this.event[component][id][name].indexOf(callbackId) === -1)
            this.event[component][id][name].push(callbackId);
        return callbackId;
    }
    dispatchEvent(component, id, name, args = null, returnValue = null, context) {
        var _a, _b;
        if ((_b = (_a = this.event[component]) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b[name]) {
            let ret = null || returnValue;
            let special = name.indexOf("pre_") > -1 || name.indexOf("post_") > -1;
            if (!special)
                ret = this.dispatchEvent(component, id, "pre_" + name, args, ret);
            for (let i in this.event[component][id][name]) {
                let callbackID = this.event[component][id][name][i];
                let mep = this.getFunction(callbackID)(args, ret);
                if (typeof mep !== "undefined") {
                    ret = mep;
                }
                if (false === ret) {
                    break;
                }
            }
            if (!special)
                ret = this.dispatchEvent(component, id, "post_" + name, args, ret);
            return ret;
        }
        else {
            console.log("no listener for ", component, id, name);
            return returnValue;
        }
    }
}
