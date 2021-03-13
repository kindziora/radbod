import { store } from './store.js';
import { middlewareHandler } from './middlewareHandler.js';
import { i18n } from './i18n.js';

export type op = { op: string, path: string, value: any };

export type validationResult = {
    result: boolean,
    msg: string,
    view: string
};

import { eventHandler } from './eventHandler.js';

export class dataHandler {
    public internationalize: i18n;
    public middlewareHandler : middlewareHandler;

    public store: { [index: string]: store } = {};
    private events: eventHandler;
    public pxy: { [index: string]: ProxyConstructor } = {};
    public environment: Object;

    constructor(eventH: eventHandler, environment: Object) {
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


        this.middlewareHandler = new middlewareHandler(environment);
        this.middlewareHandler.addMiddleware("preView");
    }

    /**
     * 
     * @param component 
     * @param data 
     */
    createStore(component: string, data: store | object): store {

        if (this.store[component] && data instanceof store) {
            this.store[component] = data;
            return this.store[component];
        } else {
            this.store[component] = new store(this.events, this, component, data);
            this.store[component].setDb(this?.environment?.data_loader);
            return this.store[component];
        }

    }

    /**
     * 
     * @param component 
     */
    destroyStore(component: string) {
        delete this.store[component];
    }

    getStore(component: string): store {
        return this.store[component];
    }

    /**
     * collect all changes then bubble event after ...what is important?
     * @param component 
     * @param changes 
     */
    changeStores(component: string, change: op) {
        console.log(component, change);
    }

}