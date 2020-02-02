import { kelement } from "./dom/element.js";

import { input } from './dom/element/input.js';
import { radio } from './dom/element/input/radio.js';
import { checkbox } from './dom/element/input/checkbox.js';
import { text } from './dom/element/input/text.js';
import { range } from './dom/element/input/range.js';
import { file } from './dom/element/input/file.js';

import { button } from './dom/element/button.js';
import { elist } from './dom/list.js';
import { select } from './dom/list/select.js';
import { textarea } from './dom/element/textarea.js';
import { component } from "./component.js";
import { store, op } from './store.js';


export class dom {
    public _area: HTMLElement = {} as HTMLElement;
    private _identifier: string = '[data-name]';

    public element: { [index: string]: kelement } = {};
    public elementByName: { [index: string]: Array<kelement> } = {};

    public elementTypes: { [index: string]: any } = { input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };

    public counter: number = 0;
    public id: string = "component-0";

    public name: string = "component-x";
    public template: Function;
    
    public views?: { [index: string]: Function };

    public store : store;

    constructor(area: HTMLElement, types: { [index: string]: any }, s: store, views?: { [index: string]: Function }) {

        this._area = area as HTMLElement;
        this.views = views;
        this.setId();
        if (area.hasAttribute('data-name')) {
            this.name = area.getAttribute('data-name');
        }else{
            this.name = area?.tagName;
        }
        this.store = s;
        this.addTypes(types);
        this.loadElements();  
    }

    setTemplate(template: Function) {
        this.template = template;
    }

    /**
     * !!caution this is slow and overwrites the home html of the dom area
     * @param data 
     */
    render(data: object){
        this.element = {};
        this.elementByName = {};

        let params = [data];
        for(let e in this.store.dataH?.store){
            params.push(this.store.dataH?.store[e].data);
        } 

        this._area.innerHTML = this.template.apply(this, params);
        this.loadElements();
    }

    /**
     * 
     * @param types 
     */
    public addTypes(types: { [index: string]: any }) {
        for (let i in types) {
            types[i].prototype = "component";
            this.elementTypes[i] = types[i];
        }
    }

    private setId() {
        this.counter++;
        let id: string = "component-" + this.counter;
        this._area.setAttribute("data-id", id);
        this.id = id;
    }

    /**
     * 
     * @param name 
     * @param $el 
     */
    private mapField(name: string, $element: Element): string {
        switch (name) {
            case "input":
                if ($element.getAttribute('type'))
                    name = <string>$element.getAttribute('type');
                break;
            case "ul": name = "list"; $element?.setAttribute('data-type', "list");
                break;
        }

        if (typeof this.elementTypes[name] === "undefined") { //unknown field type, back to default
            name = "kelement";
        }

        if ($element?.getAttribute('data-type') == "list") {
            name = "list";
        }

        return name;
    }
    
    /**
     * 
     * @param el 
     * @param where 
     * @param html 
     */
    public insertElementByElement(el: kelement, where: InsertPosition = 'beforeend', html: string) {
        el.$el?.insertAdjacentHTML(where, html);
    }

    /**
     * 
     * @param $el 
     * @param fieldTypeName 
     * @param data 
     */
    createComponent($el : Element, fieldTypeName : string, data?: Object | store) {
        let s;
        let componentObject: Object = this.elementTypes[fieldTypeName];
        let name = fieldTypeName;

        if(data instanceof store){
            s = data;
        }else if(typeof data !== "undefined"){
            s = this.store.dataH.createStore(name, data);
        }else{
            s = componentObject.data.call(this.store.dataH);
        }
        let storeArray = this.store.dataH?.store.toArray();

        let stores = this.store.dataH?.store.keys();
         // const shadowRoot = $el.attachShadow({mode: 'open'});
         if(componentObject?.views?.[name]) {
            $el.innerHTML = componentObject.views[name].apply(s, [{value:""}, ...storeArray]);
        }else{
            $el.innerHTML = componentObject.html.trim();
        }

        let ddom = new dom($el, componentObject.components || {}, s, componentObject.views);
        ddom.name = name;
        $el.setAttribute("data-name", name);

        let newcomponent = new component(ddom, s, componentObject.interactions());

        if(typeof componentObject?.views?.[name] !== "function"){ 
            newcomponent.dom.setTemplate(eval('(change,' + stores?.join(',') + ')=>`'+ newcomponent.dom._area.innerHTML +'`'));
        }else{
            newcomponent.dom.setTemplate(componentObject?.views[name]);
        } 

        return newcomponent;
    }
 
 
    /**
     * 
     * @param $el 
     * @param currentIndex 
     */
    private createElement($el: Element, currentIndex: number): kelement {
        let fieldTypeName: string = this.mapField(<string>$el.tagName.toLowerCase(), $el);

        return this.elementTypes[fieldTypeName].prototype === "component" ?
            this.createComponent($el, fieldTypeName) :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views);
    }
    /**
     * 
     * @param t_el 
     */
    detectType(t_el: kelement) {
        let last = t_el?.getName()?.split("/")?.pop();

        if (!isNaN(last) || t_el?.$el?.getAttribute('data-type') == "list-item") {
            t_el.setIsListItem(true);

            let id = t_el.$el?.parentElement?.getAttribute("data-id");
            if (id) {
                if (this.element[id]) {
                    t_el.setListContainer(this.element[id]);
                }
            }
        }

    }

    /**
     * 
     * @param $el 
     * @param currentIndex 
     */
    loadElement($el: Element, currentIndex?: number): kelement {
        this.counter++;
       
        let t_el: kelement = this.createElement($el, this.counter); //decorate and extend dom element

        this.detectType(t_el);
        this.addElement(t_el);
        this.addElementByName(t_el, <string>t_el.getName());

        this.detectOrphanVariables(t_el)
        .forEach(name => this.addElementByName(t_el, name));
        
        return t_el;
    }

    /**
     * detect orphan variable usages
     * @param t_el 
     */
    detectOrphanVariables(t_el: kelement){
        if(!t_el.$el) return [];

        let tpNode = t_el.$el.cloneNode(true);
        
        Array.from(tpNode.childNodes).map(e => {if(e.hasAttribute && e.hasAttribute("data-name"))e.remove() });

        let transForm = (m) => ("/$" + m[1])
        .replace(/\.|\[|\]|\'|\"/g, '/')
        .replace(/\/\//g, "/")
        .replace(/\/$/, '');

        let names = Array.from(tpNode.innerHTML.matchAll(/\${([\w\.\[\]]*)}/ig), transForm);
        
      //  console.log(tpNode.outerHTML);

        return names;
    }



    loadElements() {
        let element: NodeListOf<Element> = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;
       
        try {
           
            element.forEach(($el: Element, currentIndex: number) => this.loadElement($el, currentIndex));
        } catch (e) {
            console.log(e);
        }

    }

    removeElement(el: kelement) {
        el.$el.remove();
        delete this.element[<string>el.id];
    }

    addElement(el: kelement) {
        this.element[<string>el.id] = el;
    }

    addElementByName(el: kelement, name: string) {
        if (typeof this.elementByName[name] === "undefined") {
            this.elementByName[name] = [];
        }
        this.elementByName[name].push(el);
    }

    // patch  == [
    //   { op: "replace", path: "/firstName", value: "Albert"},
    //   { op: "replace", path: "/contactDetails/phoneNumbers/0/number", value: "123" },
    //   { op: "add", path: "/contactDetails/phoneNumbers/1", value: {number:"456"}}
    // ];
    /**
     * 
     * @param path 
     */
    getBestMatchingElements(path: string): Array<kelement> | [] {
        let elements: Array<kelement> = [];
        if (typeof this.elementByName[path] !== "undefined") {
            elements = this.elementByName[path];
        } else {
            let parentPath = path.split("/");
            if (parentPath.length > 1) {
                parentPath.pop();
                elements = this.getBestMatchingElements(parentPath.join('/'));
            }
        }
        return elements;
    }


}