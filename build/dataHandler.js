import { store } from './store.js';
import { i18n } from './i18n.js';
export class dataHandler {
    constructor(eventH, environment) {
        this.store = {};
        this.pxy = {};
        this.events = eventH;
        this.environment = environment;
        this.internationalize = new i18n();
        this.store.toObject = () => {
            let arr = {};
            for (let i in this.store) {
                if (typeof this.store[i] === "object")
                    arr[i] = this.store[i].data;
            }
            return arr || {};
        };
        this.store.toArray = () => {
            let arr = [];
            for (let i in this.store) {
                if (typeof this.store[i] === "object")
                    arr.push(this.store[i].data);
            }
            let e = arr.sort() || [];
            return e;
        };
        this.store.keys = () => {
            let arr = [];
            for (let i in this.store) {
                if (typeof this.store[i] === "object")
                    arr.push(i);
            }
            return arr.sort();
        };
    }
    /**
     *
     * @param component
     * @param data
     */
    createStore(component, data) {
        var _a;
        if (this.store[component] && data instanceof store) {
            this.store[component] = data;
            return this.store[component];
        }
        else {
            this.store[component] = new store(this.events, this, component, data);
            this.store[component].setDb((_a = this === null || this === void 0 ? void 0 : this.environment) === null || _a === void 0 ? void 0 : _a.data_loader);
            return this.store[component];
        }
    }
    /**
     *
     * @param component
     */
    destroyStore(component) {
        delete this.store[component];
    }
    getStore(component) {
        return this.store[component];
    }
    /**
     * collect all changes then bubble event after ...what is important?
     * @param component
     * @param changes
     */
    changeStores(component, change) {
        console.log(component, change);
    }
}
