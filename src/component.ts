import { domHandler } from './domHandler';
import { datastore, op } from './datastore';
import { kelement } from './dom/element';

export class component {
    public dom: domHandler;
    public store: datastore;

    /**
     * 
     * @param dom 
     * @param store 
     */
    constructor(dom: domHandler, store: datastore){
        this.dom = dom;
        this.store = store;
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