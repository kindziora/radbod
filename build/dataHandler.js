import * as fjp from 'fast-json-patch';
;
export class dataHandler {
    constructor(eventH) {
        this.store = {};
        this.events = eventH;
    }
    createStore(component, data) {
        this.store[component] = fjp.deepClone(data);
    }
    changeStore(changes) {
    }
    getStore() {
    }
}
