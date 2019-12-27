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
            this.updateUntilParent(change, change.path);
        }

    }

    /**
     * 
     * @param change 
     * @param path 
     */
    updateUntilParent(change: op, path: string){
        if(typeof this.dom.elementByName[change.path] !=="undefined"){
            for(let i in this.dom.elementByName[change.path]){
                let el:kelement = this.dom.elementByName[change.path][i];
                el.update([change]);
            }
        }else{
            let parentPath = path.split("/");
            parentPath.pop();
            this.updateUntilParent(change, parentPath.join('/'));
        }
    }

}