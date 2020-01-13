import { component } from "./component.js";
import { dom } from './dom.js';
import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';

export class app {
    public dataH: dataHandler;
    public components: { [index: string]: component } = {};

    constructor() {
        this.dataH = new dataHandler(new eventHandler());

    }
    /**
     * 
     * @param name 
     * @param html 
     * @param data 
     * @param actions 
     * @param injections 
     */
    createComponent(name: string, views: { [index: string]: Function }, data: object, actions: object, injections: object) {

        let store = this.dataH.createStore(name, data);
        let el = document.createElement("component");

        el.innerHTML = views?.[name](data);
        el.setAttribute("data-name", name);

        this.components[name] = new component(new dom(el, injections), store, actions);
        this.components[name].dom.setTemplate(views?.[name]);

        return this.components[name];
    }
    
    /**
     * 
     * @param name 
     * @param views 
     */
    bindViews(name:string, views: { [index: string]: Function }){
        for(let i in this.components[name].dom.element){
            let el = this.components[name].dom.element[i];
            if(el.$el.hasAttribute("data-name")){
                el.setTemplate(views?.[el?.$el?.getAttribute("data-name")]);
            }
        }
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