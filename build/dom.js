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
        var _a;
        this._area = {};
        this._identifier = ':scope *';
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
            this.name = (_a = area) === null || _a === void 0 ? void 0 : _a.tagName;
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
        var _a;
        this.element = {};
        this.elementByName = {};
        let storeObject = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        this._area.innerHTML = this.template.call(this, Object.assign(Object.assign({ change: data }, storeObject), { _t: this._t }));
        this.loadElements();
    }
    /**
     *
     * @param types
     */
    addTypes(types) {
        for (let i in types) {
            types[i].prototype = "component";
            this.elementTypes[i] = types[i];
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
        var _a, _b, _c, _d, _e, _f, _g;
        let s;
        let componentObject = this.elementTypes[fieldTypeName];
        let name = fieldTypeName.split("-")[0];
        this.componentList.push(fieldTypeName);
        if (data instanceof store) {
            s = data;
        }
        else if (typeof data !== "undefined") {
            s = this.store.dataH.createStore(name, data);
        }
        else {
            s = componentObject.data.call(this.store.dataH);
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
        if ((_d = (_c = componentObject) === null || _c === void 0 ? void 0 : _c.views) === null || _d === void 0 ? void 0 : _d[name]) {
            $el.innerHTML = componentObject.views[name].call(s, Object.assign(Object.assign({ change: { value: "" } }, storeObject), { _t }));
        }
        else {
            if (!componentObject.html) {
                $el.innerHTML = componentObject.views[name].call(s, Object.assign(Object.assign({ change: { value: "" } }, storeObject), { _t }));
            }
            else {
                $el.innerHTML = componentObject.html.trim();
            }
            // shadowRoot.innerHTML = componentObject.html.trim();
        }
        console.log(s, componentObject.views, name, componentObject);
        let ddom = new dom($el, componentObject.components || {}, s, componentObject.views, _t);
        ddom.name = name;
        $el.setAttribute("data-name", name);
        let newcomponent = new component(ddom, s, componentObject.interactions());
        newcomponent.setId(name);
        if (typeof ((_f = (_e = componentObject) === null || _e === void 0 ? void 0 : _e.views) === null || _f === void 0 ? void 0 : _f[name]) !== "function") {
            newcomponent.dom.setTemplate(eval('(args)=> { let {change, ' + args + ', _t} = args; return `' + newcomponent.dom._area.innerHTML + '`}'));
        }
        else {
            newcomponent.dom.setTemplate((_g = componentObject) === null || _g === void 0 ? void 0 : _g.views[name]);
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
    loadElements() {
        let ignore = this.componentList.join(",");
        let element = this._area.querySelectorAll(this._identifier + ignore ? `:not(${ignore})` : "");
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
