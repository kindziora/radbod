import { kelement } from "./dom/element.js";

import { input } from './dom/element/input.js';
import { radio } from './dom/element/input/radio.js';
import { checkbox } from './dom/element/input/checkbox.js';
import { text } from './dom/element/input/text.js';
import { range } from './dom/element/input/range.js';
import { file } from './dom/element/input/file.js';

import { button } from './dom/element/button.js';
import { list } from './dom/list.js';
import { select } from './dom/element/select.js';
import { textarea } from './dom/element/textarea.js';

export class domHandler {
    private _area: HTMLElement = {} as HTMLElement;
    private _identifier: string = '[data-name]';

    public element: { [index: string]: kelement } = {};
    public elementByName: { [index: string]: Array<kelement> } = {};

    public elementTypes: { [index: string]: any } = { input, text, radio, checkbox, range, file, button, list, select, textarea, kelement };

    public counter: number = 0;
    public id: string = "component-0";

    constructor(area: HTMLElement) {
        this._area = area as HTMLElement;
        this.counter++;
        this.setId();
        this.loadElements();
    }

    private setId() {
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
            case "ul": name = "list";
                break;
        }

        if (typeof this.elementTypes[name] === "undefined") { //unknown field type, back to default
            name = "kelement";
        }

        return name;
    }

    /**
     * 
     * @param $el 
     * @param currentIndex 
     */
    private createElement($el: Element, currentIndex: number): kelement {
        let fieldTypeName: string = this.mapField(<string>$el.tagName.toLowerCase(), $el);
        return new this.elementTypes[fieldTypeName]($el, this._area, currentIndex); //decorate and extend dom element
    }

    loadElements() {
        let element: NodeListOf<Element> = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;
        try {
            element.forEach(($el: Element, currentIndex: number) => {
                let t_el: kelement = this.createElement($el, currentIndex); //decorate and extend dom element

                this.addElement(t_el);
                this.addElementByName(t_el);
            }
            );
        } catch (e) {
            console.log(e);
        }

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

        if (typeof this.elementByName[path] !== "undefined") {
            return this.elementByName[path];
        } else {
            let parentPath = path.split("/");
            parentPath.pop();
            return this.getBestMatchingElements(parentPath.join('/'));
        }

    }


}