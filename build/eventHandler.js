"use strict";
class eventHandler {
    construct() {
    }
    /**
     *
     * @param component
     * @param id
     * @param name
     * @param cb
     */
    addEvent(component, id, name, cb) {
        if (typeof this.event[component] === "undefined") {
            this.event[component] = {};
        }
        if (typeof this.event[component][id] === "undefined") {
            this.event[component][id] = {};
        }
        if (typeof this.event[component][id][name] === "undefined") {
            this.event[component][id][name] = [];
        }
        this.event[component][id][name].push(cb);
    }
}
