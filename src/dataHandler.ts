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
    public middlewareHandler: middlewareHandler;

    public store: { [index: string]: store } = {};
    private events: eventHandler;
    public pxy: { [index: string]: ProxyConstructor } = {};
    public environment: Object;
    private _storage: Object = {
        data_loader: {
            find(query: Object, onResultCallback: Function) {

                setTimeout(() => onResultCallback.call({ dataH: {} }, {
                    name: "name",
                    tab: "all",
                    items: [{
                        id: 0,
                        label: "Testdaten1",
                        checked: true
                    }]
                }), 110);

            }
        }
    };

    constructor(eventH: eventHandler, environment: Object = {}) {
        this.events = eventH;
        this.environment = environment;
        this.internationalize = new i18n();

        if(this?.environment?.data_loader)
            this.setDb(this?.environment?.data_loader);

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

    db() {
        return this._storage;
    }

    setDb(db: object) {
        return this._storage = db;
    }

    /**
     * 
     * @param component 
     * @param data 
     */
    createStore(component: string, data: store | object): store {

        if (this.store[component] && data instanceof store) {
            //this.store[component] = data;
            //this.store[component].setDb(this?.db());
            console.log("try to recreate ", this.store[component], "WITH ", data, " use assign");
        } else {

            this.store[component] = new store(this.events, this, component, data);
            this.store[component].schema = JSON.stringify(data);
            this.store[component].setDb(this?.db());

        }
        return this.store[component];
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