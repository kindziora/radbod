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
export class dom {
    constructor(area, types, s) {
        var _a;
        this._area = {};
        this._identifier = '[data-name]';
        this.element = {};
        this.elementByName = {};
        this.elementTypes = { input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };
        this.counter = 0;
        this.id = "component-0";
        this.name = "component-x";
        this._area = area;
        this.setId();
        if (area.hasAttribute('data-name')) {
            this.name = area.getAttribute('data-name');
        }
        else {
            this.name = (_a = area) === null || _a === void 0 ? void 0 : _a.tagName;
        }
        this.store = s;
        this.addTypes(types);
        this.loadElements();
    }
    setTemplate(template) {
        this.template = template;
    }
    /**
     * !!caution this is slow and overwrites the home html of the dom area
     * @param data
     */
    render(data) {
        var _a, _b;
        this.element = {};
        this.elementByName = {};
        let params = [data];
        for (let e in (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store) {
            params.push((_b = this.store.dataH) === null || _b === void 0 ? void 0 : _b.store[e].data);
        }
        this._area.innerHTML = this.template.apply(this, params);
        this.loadElements();
    }
    /**
     *
     * @param types
     */
    addTypes(types) {
        for (let i in types) {
            this.elementTypes[i] = types[i];
        }
    }
    setId() {
        this.counter++;
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
        var _a, _b;
        switch (name) {
            case "input":
                if ($element.getAttribute('type'))
                    name = $element.getAttribute('type');
                break;
            case "ul":
                name = "list";
                (_a = $element) === null || _a === void 0 ? void 0 : _a.setAttribute('data-type', "list");
                break;
        }
        if (typeof this.elementTypes[name] === "undefined") { //unknown field type, back to default
            name = "kelement";
        }
        if (((_b = $element) === null || _b === void 0 ? void 0 : _b.getAttribute('data-type')) == "list") {
            name = "list";
        }
        return name;
    }
    insertElementByElement(el, where = 'beforeend', html) {
        var _a;
        (_a = el.$el) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(where, html);
    }
    /**
     *
     * @param $el
     * @param currentIndex
     */
    createElement($el, currentIndex) {
        let fieldTypeName = this.mapField($el.tagName.toLowerCase(), $el);
        return this.elementTypes[fieldTypeName].prototype instanceof component ?
            this.elementTypes[fieldTypeName] :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this);
    }
    /**
     *
     * @param t_el
     */
    detectType(t_el) {
        var _a, _b, _c, _d, _e, _f, _g;
        let last = (_c = (_b = (_a = t_el) === null || _a === void 0 ? void 0 : _a.getName()) === null || _b === void 0 ? void 0 : _b.split("/")) === null || _c === void 0 ? void 0 : _c.pop();
        if (!isNaN(last) || ((_e = (_d = t_el) === null || _d === void 0 ? void 0 : _d.$el) === null || _e === void 0 ? void 0 : _e.getAttribute('data-type')) == "list-item") {
            t_el.setIsListItem(true);
            let id = (_g = (_f = t_el.$el) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.getAttribute("data-id");
            if (id) {
                if (this.element[id]) {
                    t_el.setListContainer(this.element[id]);
                }
            }
        }
    }
    loadElement($el, currentIndex) {
        this.counter++;
        let t_el = this.createElement($el, this.counter); //decorate and extend dom element
        this.detectType(t_el);
        this.addElement(t_el);
        this.addElementByName(t_el);
        return t_el;
    }
    loadElements() {
        let element = this._area.querySelectorAll(this._identifier);
        try {
            element.forEach(($el, currentIndex) => this.loadElement($el, currentIndex));
        }
        catch (e) {
            console.log(e);
        }
    }
    removeElement(el) {
        el.$el.remove();
        delete this.element[el.id];
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
        let elements = [];
        if (typeof this.elementByName[path] !== "undefined") {
            elements = this.elementByName[path];
        }
        else {
            let parentPath = path.split("/");
            if (parentPath.length > 1) {
                parentPath.pop();
                elements = this.getBestMatchingElements(parentPath.join('/'));
            }
        }
        return elements;
    }
}