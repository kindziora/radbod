import { domHandler } from './domHandler.js';
import { store, op } from './store.js';
import { kelement } from './dom/element.js';

export class component {
    public dom: domHandler;
    public store: store;

    /**
     * 
     * @param dom 
     * @param store 
     */
    constructor(dom: domHandler, store: store){
        this.dom = dom;
        this.store = store;
        this.store.events?.addEvent(this.dom.name, this.dom.name, "change", this.update);
    }

    set(path:string, value:any){

    }

    get(path:string):any{

    }

    update(changes: Array<op>) {

        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];
            this.dom.getBestMatchingElements(change.path)
            .forEach((el)=>el.update([change]));
        }

    }


}