import * as fjp from 'fast-json-patch';
import {store} from './store';

export interface op { op: string, path: string, value: any };
import { eventHandler } from './eventHandler.js';

export class dataHandler {

    public store: { [index: string]: Object } = {};
    private events: eventHandler;
    public relations: { [index: string]: Object } = {};

    constructor(eventH: eventHandler) {
        this.events = eventH;
    } 

    createStore(component: string, data: Object) {
        this.store[component] = new store(this.events, this);
        this.relations[component] = {};
        
    }

    addStoreRelations(component: string){
        for(let e in this.store[component].data){
            this.store[component].data
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