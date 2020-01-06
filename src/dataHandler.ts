import * as fjp from 'fast-json-patch';
import {store} from './store';

export interface op { op: string, path: string, value: any };
import { eventHandler } from './eventHandler.js';

export class dataHandler {

    public store: { [index: string]: store } = {};
    private events: eventHandler;
    public relations: { [index: string]: Object } = {};

    constructor(eventH: eventHandler) {
        this.events = eventH;
    } 

    createStore(component: string, data: Object) {
        this.store[component]: store = new store(this.events, this);
        this.relations[component] = {};
        
    }

    addStoreRelations(component: string){
        for(let e in this.store){
            if(e === component)continue;
            let other = this.store[e].getPaths();
            for(let eo of other){
                if(eo.indexOf("$" + component) > -1){
                    this.addRelation(component, e, eo);
                }
            }
        }
    }

    unmaskComponentName(component: string){
        return component.charAt(0) === "$" ? component.substr(1) : component;
    }

    addRelation(fromComponent: string, component: string, FullPath:string){
        component = this.unmaskComponentName(component);
        this.relations[component][FullPath] = component;
    }

    changeStore(component: string, changes: Array<op>){

    }

    notifyStores(component: string, changes: Array<op>){
        
    }

    getStore(component: string){
        return this.store[component];
    }
}