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
import { store } from './store.js';
import { i18n } from './i18n.js';
export class dom {
    constructor(area, types, s, views, _t) {
        this._area = {};
        this._identifier = ':scope *';
        this.componentList = [];
        this.element = {};
        this.elementByName = {};
        this.elementTypes = { input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };
        this.counter = 0;
        this.id = "c-0";
        this.name = "c-x";
        this._area = area;
        this.$el = this._area;
        this.views = views;
        this._t = _t;
        if (area.hasAttribute('data-name')) {
            this.name = area.getAttribute('data-name');
        }
        else {
            this.name = area === null || area === void 0 ? void 0 : area.tagName;
        }
        this.setId();
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
        let storeObject = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        this._area.innerHTML = this.template.call(this, Object.assign(Object.assign({ change: data }, storeObject), { _t: this._t }));
        this.loadElements();
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(this.name, this.name, "post_render", { change: data, domScope: this.$el }, storeObject);
    }
    /**
     *
     * @param types
     */
    addTypes(types) {
        for (let i in types) {
            types[i].prototype = "component";
            this.elementTypes[i] = types[i];
            this.componentList.push(i);
        }
    }
    setId() {
        this.counter++;
        let id = this.name || "c" + "-" + this.counter;
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
                $element === null || $element === void 0 ? void 0 : $element.setAttribute('data-type', "list");
                break;
        }
        if (typeof this.elementTypes[name] === "undefined") { //unknown field type, back to default
            name = "kelement";
        }
        if (($element === null || $element === void 0 ? void 0 : $element.getAttribute('data-type')) == "list") {
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
    insertElementByElement(el, where = 'beforeend', html) {
        var _a;
        (_a = el.$el) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(where, html);
    }
    /**
     *
     * @param $el
     * @param fieldTypeName
     * @param data
     */
    createComponent($el, fieldTypeName, data) {
        var _a, _b, _c, _d;
        let s;
        let componentObject = this.elementTypes[fieldTypeName];
        let name = fieldTypeName.split("-")[0];
        if (data instanceof store) {
            s = data;
        }
        else if (typeof data !== "undefined") {
            s = this.store.dataH.createStore(name, data);
        }
        else {
            if (this.store.dataH.store[name]) {
                s = this.store.dataH.store[name];
            }
            else {
                s = componentObject.data.call(this.store.dataH);
            }
            if (s instanceof store) {
            }
            else {
                s = this.store.dataH.createStore(name, s || {});
            }
        }
        let storeObject = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        let args = (_b = this.store.dataH) === null || _b === void 0 ? void 0 : _b.store.keys();
        let internationalize = new i18n();
        internationalize.addTranslation(componentObject.translations ? componentObject.translations() : {});
        let _t = (text, lang) => internationalize._t(text, lang);
        if ((_c = componentObject === null || componentObject === void 0 ? void 0 : componentObject.views) === null || _c === void 0 ? void 0 : _c[name]) {
            $el.innerHTML = componentObject.views[name].call(componentObject, Object.assign(Object.assign({ change: { value: "" } }, storeObject), { _t }));
        }
        else {
            if (!componentObject.html) {
                $el.innerHTML = componentObject.views[name].call(componentObject, Object.assign(Object.assign({ change: { value: "" } }, storeObject), { _t }));
            }
            else {
                $el.innerHTML = componentObject.html.trim();
            }
            // shadowRoot.innerHTML = componentObject.html.trim();
        }
        let ddom = new dom($el, componentObject.components || {}, s, componentObject.views, _t);
        ddom.name = name;
        $el.setAttribute("data-name", name);
        console.log("CREATE COMPONENT:", name, s, componentObject.views, componentObject);
        let newcomponent = new component(ddom, s, componentObject.interactions());
        newcomponent.setId(name);
        if (typeof ((_d = componentObject === null || componentObject === void 0 ? void 0 : componentObject.views) === null || _d === void 0 ? void 0 : _d[name]) !== "function") {
            newcomponent.dom.setTemplate(eval('(function (args) { let {change, ' + args + ', _t} = args; return `' + newcomponent.dom._area.innerHTML + '`})'));
        }
        else {
            newcomponent.dom.setTemplate(componentObject === null || componentObject === void 0 ? void 0 : componentObject.views[name]);
        }
        return newcomponent;
    }
    /**
     *
     * @param $el
     * @param currentIndex
     */
    createElement($el, currentIndex) {
        let fieldTypeName = this.mapField($el.tagName.toLowerCase(), $el);
        return this.elementTypes[fieldTypeName].prototype === "component" ?
            this.createComponent($el, fieldTypeName) :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views, this._t);
    }
    /**
     *
     * @param t_el
     */
    detectType(t_el) {
        var _a, _b, _c, _d, _e;
        let last = (_b = (_a = t_el === null || t_el === void 0 ? void 0 : t_el.getName()) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop();
        if (!isNaN(last) || ((_c = t_el === null || t_el === void 0 ? void 0 : t_el.$el) === null || _c === void 0 ? void 0 : _c.getAttribute('data-type')) == "list-item") {
            t_el.setIsListItem(true);
            let id = (_e = (_d = t_el.$el) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.getAttribute("data-id");
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
    loadElement($el, currentIndex) {
        this.counter++;
        let t_el = this.createElement($el, this.counter); //decorate and extend dom element
        this.detectType(t_el);
        this.addElement(t_el);
        if (t_el.getName()) {
            this.addElementByName(t_el, t_el.getName());
        }
        else {
            this.detectOrphanVariables(t_el)
                .forEach(name => this.addElementByName(t_el, name));
        }
        return t_el;
    }
    /**
     * detect orphan variable usages
     * @param t_el
     */
    detectOrphanVariables(t_el) {
        if (!t_el.$el)
            return [];
        let tpNode = t_el.$el.cloneNode(true);
        Array.from(tpNode.childNodes).map(e => { if (e.hasAttribute && e.hasAttribute("data-name"))
            e.remove(); });
        let transForm = (m) => ("/$" + m[1])
            .replace(/\.|\[|\]|\'|\"/g, '/')
            .replace(/\/\//g, "/")
            .replace(/\/$/, '');
        let tpl = Array.from((t_el.template ? t_el.template.toString() : t_el.$el.innerHTML).matchAll(/return `(\$.*)`/gm))[0];
        let names = [];
        if (tpl && tpl[1]) {
            names = Array.from(tpl[1].matchAll(/\${([\w\.\[\]]*)}/ig), transForm);
        }
        //  console.log(tpNode.outerHTML);
        return names;
    }
    loadElementsScoped($scope) {
        let element = $scope.querySelectorAll(this._identifier);
        try {
            element.forEach(($el, currentIndex) => this.loadElement($el, currentIndex));
        }
        catch (e) {
            console.log(e);
        }
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
    addElementByName(el, name) {
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
    getBestMatchingElements(path) {
        let elements = [];
        if (typeof this.elementByName[path] !== "undefined") {
            return this.elementByName[path];
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
