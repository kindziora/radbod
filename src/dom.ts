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

    public store : store;

    constructor(area: HTMLElement, types: { [index: string]: any }, s: store) {

        this._area = area as HTMLElement;
       
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
        this._area.innerHTML = this.template(data);
        this.loadElements();
    }

    /**
     * 
     * @param types 
     */
    public addTypes(types: { [index: string]: any }) {
        for (let i in types) {
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

    public insertElementByElement(el: kelement, where: InsertPosition = 'beforeend', html: string) {
        el.$el?.insertAdjacentHTML(where, html);
    }

    /**
     * 
     * @param $el 
     * @param currentIndex 
     */
    private createElement($el: Element, currentIndex: number): kelement {
        let fieldTypeName: string = this.mapField(<string>$el.tagName.toLowerCase(), $el);
        
        return this.elementTypes[fieldTypeName].prototype instanceof component ?
            this.elementTypes[fieldTypeName] :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this);
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

    loadElement($el: Element, currentIndex?: number): kelement {
        this.counter++;
       
        let t_el: kelement = this.createElement($el, this.counter); //decorate and extend dom element

        this.detectType(t_el);
        this.addElement(t_el);
        this.addElementByName(t_el);

        return t_el;
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

    addElementByName(el: kelement) {
        if (typeof this.elementByName[<string>el.getName()] === "undefined") {
            this.elementByName[<string>el.getName()] = [];
        }
        this.elementByName[<string>el.getName()].push(el);
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