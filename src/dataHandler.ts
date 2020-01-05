import * as fjp from 'fast-json-patch';

export interface op { op: string, path: string, value: any };
import { eventHandler } from './eventHandler.js';

export class dataHandler {

    public store: { [index: string]: Object } = {};
    private events: eventHandler;

    constructor(eventH: eventHandler) {
        this.events = eventH;
    } 

    createStore(component: string, data: Object) {
        this.store[component] = fjp.deepClone(data);
    }

    changeStore(changes: Array<op>){

    }

    getStore(){
        
    }
}