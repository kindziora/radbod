export * from '../node_modules/fast-json-patch/index';
;
export class dataHandler {
    constructor(eventH) {
        this.store = {};
        this.events = eventH;
    }
    createStore(component, data) {
        this.store[component] = deepClone(data);
    }
}
