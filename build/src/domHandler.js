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
    constructor(area) {
        this._area = {};
        this._identifier = '[data-name]';
        this.element = {};
        this.elementByName = {};
        this.elementTypes = { input, text, radio, checkbox, range, file, button, list, select, textarea, kelement };
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
    /**
     *
     * @param name
     * @param $el
     */
    mapField(name, $element) {
        switch (name) {
            case "input":
                if ($element.getAttribute('type'))
                    name = $element.getAttribute('type');
                break;
            case "ul":
                name = "list";
                break;
        }
        if (name === "ul") {
            name = "list";
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
    createElement($el, currentIndex) {
        let fieldTypeName = this.mapField($el.tagName.toLowerCase(), $el);
        return new this.elementTypes[fieldTypeName]($el, this._area, currentIndex); //decorate and extend dom element
    }
    loadElements() {
        let element = this._area.querySelectorAll(this._identifier);
        try {
            element.forEach(($el, currentIndex) => {
                let t_el = this.createElement($el, currentIndex); //decorate and extend dom element
                this.addElement(t_el);
                this.addElementByName(t_el);
            });
        }
        catch (e) {
            console.log(e);
        }
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
    // patch  == [
    //   { op: "replace", path: "/firstName", value: "Albert"},
    //   { op: "replace", path: "/contactDetails/phoneNumbers/0/number", value: "123" },
    //   { op: "add", path: "/contactDetails/phoneNumbers/1", value: {number:"456"}}
    // ];
    /**
     *
     * @param path
     */
    getBestMatchingElements(path) {
        if (typeof this.elementByName[path] !== "undefined") {
            return this.elementByName[path];
        }
        else {
            let parentPath = path.split("/");
            parentPath.pop();
            return this.getBestMatchingElements(parentPath.join('/'));
        }
    }
}
