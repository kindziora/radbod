import * as fjp from 'fast-json-patch';
import {store} from './store.js';

export interface op { op: string, path: string, value: any };
import { eventHandler } from './eventHandler.js';

export class dataHandler {

    public store: { [index: string]: store } = {};
    private events: eventHandler;
    public relations: { [index: string]: Object } = {};

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
        this.relations[component] = {};
        this.addStoreRelations(component);
    }
    /**
     * 
     * @param component 
     */
    addStoreRelations(component: string){
        let ownPaths = this.store[component].getPaths();
        for(let e in this.store){
            if(e === component)continue;
            let other = this.store[e].getPaths();

            for(let eo of other){
                if(eo.indexOf("$" + component) > -1){ 
                    this.addRelation(component, e, eo); //relations to others inside component
                }
            }
            for(let p of ownPaths){
                if(p.indexOf("$" + e) > -1){
                    this.addRelation(e, component, p); //relations to component from others
                }
            }
        }
    }

    unmaskComponentName(component: string){
        return component.charAt(0) === "$" ? component.substr(1) : component;
    }

    /**
     * 
     * @param fromComponent 
     * @param component 
     * @param FullPath 
     */
    addRelation(fromComponent: string, component: string, FullPath:string){
        component = this.unmaskComponentName(component);
        fromComponent = this.unmaskComponentName(fromComponent);
        if(typeof this.relations[fromComponent][component] ==="undefined"){
            this.relations[fromComponent][component] = {};
        }
        this.relations[fromComponent][component][FullPath?.split("/$")?.[1]?.replace(fromComponent, "")] = FullPath;
    }

    /**
     * 
     * @param component 
     * @param changes 
     */
    changeStore(component: string, changes: Array<op>){
        
    }

    notifyStores(component: string, changes: Array<op>){
        
    }

    getStore(component: string){
        return this.store[component];
    }
}