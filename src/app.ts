import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';
import { store } from './store.js';

export class app {
    public dataH: dataHandler;
    public components: { [index: string]: component } = {};

    constructor() {
        this.dataH = new dataHandler(new eventHandler());

    }
    
    /**
     * 
     * @param name 
     */
    removeComponent(name: string) {
        delete this.components[name];
    }

    /**
     * 
     * @param url 
     */
    render(url:string){
        
    }

}