import { input } from './dom/element/input.js';
export class domHandler {
    constructor(area) {
        this._area = {};
        this._identifier = '[data-name]';
        this.element = {};
        this.elementByName = {};
        this.elementTypes = { input };
        this.counter = 0;
        this.id = "component-0";
        this._area = area;
        this.counter++;
        this.setId();
        this.loadElements();
    }
    setId() {
        let id = "component-" + this.counter;
        this._area.setAttribute("data-id", id);
        this.id = id;
    }
    loadElements() {
        let element = this._area.querySelectorAll(this._identifier);
        console.log(element.length);
        element.forEach(($el, currentIndex) => {
            let t_el = new this.elementTypes[$el.tagName.toLowerCase()]($el, this._area, currentIndex); //decorate and extend dom element
            this.addElement(t_el);
            this.addElementByName(t_el);
        });
    }
    addElement(el) {
        this.element[el.id] = el;
    }
    addElementByName(el) {
        if (typeof this.elementByName[el.getName()] === "undefined") {
            this.elementByName[el.getName()] = [];
        }
        this.elementByName[el.getName()].push(el);
    }
}
