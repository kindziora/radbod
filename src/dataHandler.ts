import { store } from './store.js';

export interface op { op: string, path: string, value: any };
import { eventHandler } from './eventHandler.js';

export class dataHandler {

    public store: { [index: string]: store } = {};
    private events: eventHandler;
    public pxy: { [index: string]: ProxyConstructor } = {};

    constructor(eventH: eventHandler) {
        this.events = eventH;
    }

    /**
     * 
     * @param component 
     * @param data 
     */
    createStore(component: string, data: Object) {
        this.store[component] = new store(this.events, this, component, data);
        return this.store[component];
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

        /* for(let i in this.relations[component]){
             console.log(i, this.store[i].data, this.relations[component][i]);
             //fjp.default.applyPatch(this.store[i].data, change);
 
         }
         */
    }

}