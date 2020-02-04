import { store } from './store.js';
;
export class dataHandler {
    constructor(eventH) {
        this.store = {};
        this.pxy = {};
        this.events = eventH;
        this.store.toArray = () => {
            let arr = [];
            for (let i in this.store) {
                if (typeof this.store[i] === "object")
                    arr.push(this.store[i]);
            }
            return arr.sort();
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
        this.store[component] = new store(this.events, this, component, data);
        return this.store[component];
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
        /* for(let i in this.relations[component]){
             console.log(i, this.store[i].data, this.relations[component][i]);
             //fjp.default.applyPatch(this.store[i].data, change);
 
         }
         */
    }
}
