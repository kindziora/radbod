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
<<<<<<< HEAD
    /**
=======
    
 /**
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
     * 
     * @param name 
     * @param html 
     * @param data 
     * @param actions 
     * @param injections 
     */
<<<<<<< HEAD
    createComponent(name: string, views: { [index: string]: Function }, data: Object | store, actions: object, injections: object) {
=======
    createComponent(name: string, views: { [index: string]: string }, data: Object | store, actions: object, injections: object) {
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
        let s;
     
        if(data instanceof store){
            s = data;
        }else{
            s = this.dataH.createStore(name, data);
        } 
        
        let el = document.createElement("component");
<<<<<<< HEAD

        if(typeof views?.[name] ==="function"){
            el.innerHTML = views?.[name](data);
        } else{
            el.innerHTML = views?.[name];
        }
=======
        
        el.innerHTML = views?.[name];
        
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc

        let ddom = new dom(el, injections, s);
        ddom.name = name;
        el.setAttribute("data-name", name);

        this.components[name] = new component(ddom, s, actions);

        if(typeof views?.[name] !== "function"){ 
            let stores = Object.keys(this.dataH?.store)?.join(',');
     
            this.components[name].dom.setTemplate(eval('(change,' + stores + ')=>`'+ this.components[name].dom._area.innerHTML +'`'));
        }else{
            this.components[name].dom.setTemplate(views?.[name]);
        } 

        return this.components[name];
    }
<<<<<<< HEAD
 
=======
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc

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