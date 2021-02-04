;
export class eventHandler {
    constructor() {
        this.event = {};
        this.eventByElement = {};
    }
    construct() {
    }
    /**
     *  @TODO event handler geht noch nicht, unter anderem doppelte change events und komisches verhalten
     */
    remove(path, name) {
        delete this.event[path][name];
    }
    removeByElement(component, element) {
        var _a;
        (_a = this.eventByElement[component]) === null || _a === void 0 ? void 0 : _a.delete(element);
    }
    add(path, name, cb, context) {
        console.log("%cADD CUSTOM EVENT ", "color: green; font-size: 12px", path, name);
        if (typeof cb !== "function")
            return false;
        if (typeof this.event[path] === "undefined") {
            this.event[path] = {};
        }
        if (typeof this.event[path][name] === "undefined") {
            this.event[path][name] = [];
        }
        if (this.event[path][name].indexOf({ cb, context }) === -1) {
            this.event[path][name].push({ cb, context });
            return true;
        }
        else {
            return false;
        }
    }
    addByElement(component, id, name, cb, context) {
        if (typeof cb !== "function")
            return false;
        if (typeof this.eventByElement[component] === "undefined") {
            this.eventByElement[component] = new WeakMap();
        }
        let callbacks = this.eventByElement[component].get(id) || new Map();
        if (!callbacks.has(cb)) {
            callbacks.set(cb, { name, context });
            console.log("%cADD EVENT TO $EL", "color: lightgreen; font-size: 12px", component, id, name);
            this.eventByElement[component].set(id, callbacks);
            return true;
        }
        else {
            return false;
        }
    }
    dispatchEvent(component, id, name, args = null, returnValue = null, context) {
        var _a;
        let eventMap = [];
        if (typeof id !== "string") {
            let tmpData = (_a = this.eventByElement[component]) === null || _a === void 0 ? void 0 : _a.get(id);
            for (let [cb, v] of tmpData) {
                if (v.name === name)
                    eventMap.push({ cb, context: v.context });
            }
        }
        else {
            eventMap = this.event[id] && this.event[id][name] ? this.event[id][name] : [];
        }
        if (eventMap) {
            let ret = null || returnValue;
            let special = name.indexOf("pre_") > -1 || name.indexOf("post_") > -1;
            if (!special)
                ret = this.dispatchEvent(component, id, "pre_" + name, args, ret);
            for (let i in eventMap) {
                console.log(`%cFIRE ${(typeof id !== "string") ? "$EL" : "CUSTOM"} EVENT `, "color: red; font-size: 12px", component, id, name, i, eventMap[i].cb);
                let mep = eventMap[i].cb.call(eventMap[i].context, args, ret);
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
