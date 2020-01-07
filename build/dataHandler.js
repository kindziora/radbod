import { store } from './store.js';
;
export class dataHandler {
    constructor(eventH) {
        this.store = {};
        this.relations = {};
        this.pxy = {};
        this.events = eventH;
    }
    /**
     *
     * @param component
     * @param data
     */
    createStore(component, data) {
        this.store[component] = new store(this.events, this, component, data);
        this.relations[component] = {};
        this.addStoreRelations(component);
    }
    getStore(component) {
        return this.store[component];
    }
    /**
     *
     * @param component
     */
    addStoreRelations(component) {
        let ownPaths = this.store[component].getPaths();
        for (let e in this.store) {
            if (e === component)
                continue;
            let other = this.store[e].getPaths();
            for (let eo of other) {
                if (eo.indexOf("$" + component) > -1) {
                    this.addRelation(component, e, eo); //relations to others inside component
                }
            }
            for (let p of ownPaths) {
                if (p.indexOf("$" + e) > -1) {
                    this.addRelation(e, component, p); //relations to component from others
                }
            }
        }
    }
    unmaskComponentName(component) {
        return component.charAt(0) === "$" ? component.substr(1) : component;
    }
    /**
     *
     * @param fromComponent
     * @param component
     * @param FullPath
     */
    addRelation(fromComponent, component, FullPath) {
        var _a, _b, _c;
        component = this.unmaskComponentName(component);
        fromComponent = this.unmaskComponentName(fromComponent);
        if (typeof this.relations[fromComponent][component] === "undefined") {
            this.relations[fromComponent][component] = {};
        }
        this.relations[fromComponent][component][(_c = (_b = (_a = FullPath) === null || _a === void 0 ? void 0 : _a.split("/$")) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.replace(fromComponent, "")] = FullPath;
    }
    /**
     * collect all changes then bubble event after ...what is important?
     * @param component
     * @param changes
     */
    changeStores(component, change) {
        console.log(component, change);
        /* for(let i in this.relations[component]){
             console.log(i, this.store[i].data, this.relations[component][i]);
             //fjp.default.applyPatch(this.store[i].data, change);
 
         }
         */
    }
    notifyStores(component, changes) {
    }
}
