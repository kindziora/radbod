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
import { listItem } from './dom/list/listItem.js';

import { textarea } from './dom/element/textarea.js';
import { component } from "./component.js";
import { store, op } from './store.js';
import { i18n } from './i18n.js';


export class dom {
    public _area: HTMLElement = {} as HTMLElement;
    private _identifier: string = ':scope *';
    public componentList: Array<string> = [];
    public element: { [index: string]: kelement } = {};
    public elementByName: { [index: string]: Array<kelement> } = {};

    public elementTypes: { [index: string]: any } = { listItem, input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };

    public counter: number = 0;
    public id: string = "c-0";

    public name: string = "c-x";
    public template: Function;

    public views?: { [index: string]: Function };

    public store: store;
    public $el: HTMLElement;

    public _t: Function;

    public kelementBy$el: WeakMap<HTMLElement, kelement>;

    constructor(area: HTMLElement, types: { [index: string]: any }, s: store, views: { [index: string]: Function }, _t: Function, counter: number = 0) {

        this._area = area as HTMLElement;
        this.$el = this._area;
        this.views = views;
        this._t = _t;
        this.kelementBy$el = new WeakMap();

        if (area.hasAttribute('data-name')) {
            this.name = area.getAttribute('data-name');
        } else {
            this.name = area?.tagName;
        }
        this._identifier = `:scope *`;
        this.counter = counter;
        this.setId();

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
    render(data: object) {
        this.element = {};
        this.elementByName = {};
        let storeObject = this.store.dataH?.store.toObject();
        this._area.innerHTML = (this.template.call(this, { change: data, ...storeObject, _t: this._t }) +"").trim();

        this.kelementBy$el = new WeakMap();

        this.loadElements();

        this.store.events?.dispatchEvent(this.name, `/$${this.name}`, "post_render", { change: data, domScope: this.$el, readd: true }, storeObject);

    }

    /**
     * 
     * @param types 
     */
    public addTypes(types: { [index: string]: any }) {
        for (let i in types) {
            types[i].prototype = "component";
            this.elementTypes[i] = types[i];
            this.componentList.push(i);
        }
    }

    private setId() {
        let id: string = this.name || "c" + "-" + this.counter;
        this._area.setAttribute("data-id", id);
        this.id = id;
        this.counter++;
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

        if ($element?.getAttribute('data-type') == "list-item") {
            name = "listItem";
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
    createComponent($el: Element, fieldTypeName: string, data?: Object | store) {
        let s;
        let componentObject: Object = this.elementTypes[fieldTypeName];
        let name = fieldTypeName.split("-")[0];

        if (data instanceof store) {
            s = data;
        } else if (typeof data !== "undefined") {
            s = this.store.dataH.createStore(name, data);
        } else {
            if (this.store.dataH.store[name]) {
                s = this.store.dataH.store[name];
            } else {
                s = componentObject.data.call(this.store.dataH);
            }

            if (s instanceof store) {

            } else {
                s = this.store.dataH.createStore(name, s || {});
            }
        }

        if (typeof componentObject.validations !== "undefined")
            s.addValidations(componentObject.validations);

        let storeObject = this.store.dataH?.store.toObject();

        let args = this.store.dataH?.store.keys();

        let internationalize = new i18n();
        internationalize.addTranslation(componentObject.translations ? componentObject.translations() : {});

        let _t = (text: string, lang?: string) => internationalize._t(text, lang);


        if (componentObject?.views?.[name]) {

            $el.innerHTML = (componentObject.views[name].call(componentObject, { change: { value: "" }, ...storeObject, _t }) +"").trim();
        } else {
            if (!componentObject.html) {
                $el.innerHTML = (componentObject.views[name].call(componentObject, { change: { value: "" }, ...storeObject, _t }) + "").trim();
            } else {
                $el.innerHTML = componentObject.html.trim();
            }

            // shadowRoot.innerHTML = componentObject.html.trim();
        }


        let ddom = new dom($el, componentObject.components || {}, s, componentObject.views, _t, this.counter);
        ddom.name = name;
        $el.setAttribute("data-name", name);

        if(componentObject.style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = componentObject.style;
            $el.append(stEl);
        }

        console.log("CREATE COMPONENT:", name, s, componentObject.views, componentObject);

        let newcomponent = new component(ddom, s, componentObject.interactions.call({ componentObject, dom: ddom }));
        newcomponent.setId(name);

        if (typeof componentObject?.views?.[name] !== "function") {
            newcomponent.dom.setTemplate(eval('(function (args) { let {change, ' + args + ', _t} = args; return `' + newcomponent.dom._area.innerHTML.trim() + '`})'));
        } else {
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
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views, this._t);
    }

    isElementComponent($el: Element): boolean {
        return this.elementTypes[this.mapField(<string>$el.tagName.toLowerCase(), $el)].prototype === "component";
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

        if (!this.kelementBy$el.get($el)) {
            this.counter++;

            let t_el: kelement = this.createElement($el, this.counter); //decorate and extend dom element
            this.detectType(t_el);
            this.addElement(t_el);

            if (t_el.getName()) {
                this.addElementByName(t_el, <string>t_el.getName());
            } else {
                this.detectOrphanVariables(t_el)
                    .forEach(name => this.addElementByName(t_el, name));

            }

            this.kelementBy$el.set($el, t_el);
            return t_el;

        } else {
            return this.kelementBy$el.get($el);
        }

    }

    /**
     * detect orphan variable usages
     * @param t_el 
     */
    detectOrphanVariables(t_el: kelement) {
        if (!t_el.$el) return [];

        let tpNode = t_el.$el.cloneNode(true);

        Array.from(tpNode.childNodes).map(e => { if (e.hasAttribute && e.hasAttribute("data-name")) e.remove() });

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

    _load($el: Element, currentIndex: number): kelement {

        if (!$el?.hasAttribute("data-id")) {
           return this.loadElement($el, currentIndex);
        } else if ( ($el?.getAttribute("data-id")?.indexOf(this.name) !== -1) || this.isElementComponent($el) || $el?.getAttribute("data-name")?.indexOf("/_state") !== -1) {
           return this.loadElement($el, currentIndex);
        }
        return this.kelementBy$el.get($el);
    }

    loadElementsScoped($scope: Element) : kelement[]{
        let loaded : kelement[] = [];
        let element: NodeListOf<Element> = $scope.querySelectorAll(this._identifier) as NodeListOf<Element>;

        try {
           
            loaded = Array.from(element).map(($el: Element, currentIndex: number) => this._load($el, currentIndex)).filter(e=>e);

            let l = this._load($scope, this.counter);
            if(l) loaded.push(l);

        } catch (e) {
            console.log("FIELD NOT LOADED ERROR:", e);
        }
        return loaded;
    }

    loadElements() {
        
        let element: NodeListOf<Element> = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;

        try {
            element.forEach(($el: Element, currentIndex: number) => this._load($el, currentIndex));
        } catch (e) {
            console.log(e);
        }

    }



    _removeElement(el: kelement) {

        delete this.element[<string>el.id];
        let name: string = el.getName();
        if (typeof this.elementByName[name] !== "undefined") {
            this.elementByName[name] = this.elementByName[name].filter(function (element) {
                return element.id !== <string>el.id;
            });
        }
        this.kelementBy$el.delete(el.$el);
        el.$el.remove();
    }

    removeElement(el: kelement) {

        let children: NodeListOf<Element> = el.$el.querySelectorAll(this._identifier) as NodeListOf<Element>;
        try {
            children.forEach(($el: Element, currentIndex: number) => this._removeElement(this.kelementBy$el.get($el)));
        } catch (e) {
            console.log(e);
        }

        this._removeElement(el);

    }

    addElement(el: kelement) {
        this.element[<string>el.id] = el;
    }

    addElementByName(el: kelement, name: string) {
        if (typeof this.elementByName[name] === "undefined") {
            this.elementByName[name] = [];
        }
        if (!el.$el.hasAttribute("data-name"))
            el.$el.setAttribute("data-name", name);

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
    getBestMatchingElements(path: string, searchAncestors: boolean = true): Array<kelement> | [] {

        let elements: Array<kelement> = [];
        if (typeof this.elementByName[path] !== "undefined") {
            return this.elementByName[path];
        } else if (searchAncestors) {
            let parentPath = path.split("/");
            if (parentPath.length > 1) {
                parentPath.pop();
                elements = this.getBestMatchingElements(parentPath.join('/'));
            }
        }
        return elements;
    }

    findMatchingElements(path: string): Array<kelement> | [] {
        let onlyListContainer: Array<kelement> = [];
        let elementsDetailedMatch: Array<kelement> = this.getBestMatchingElements(path);
        let ArrayParentPath: string = this.getArrayParentPath(path);


        if (ArrayParentPath !== path) { //get array container
            onlyListContainer = this.getBestMatchingElements(ArrayParentPath).filter(function (item) {
                return item.constructor.name === "elist";
            }).filter(function (item) {
                for (let i in elementsDetailedMatch) {
                    if (item.$el.contains(elementsDetailedMatch[i].$el)) {
                        return false;
                    }
                }
                return true;
            });
        }

        return [...onlyListContainer, ...elementsDetailedMatch];
    }

    getArrayParentPath(path: string): string {

        let parts: string[] = path.split("/");
        for (let i in parts) {
            if (parseInt(parts[i]) == parts[i]) {
                parts.splice(i);
                break;
            }
        }
        return parts.join("/");
    }

    getArrayItemPath(path: string): string {

        let parts: string[] = path.split("/");
        for (let i in parts) {
            if (parseInt(parts[i]) == parts[i]) {
                return parts.splice(0, parseInt(i) + 1).join("/");
            }
        }
        return parts.join("/");
    }

    pathContainsArray(path: string): boolean {
        return this.getArrayParentPath(path) !== path;
    }

    getParents($scope: HTMLElement, selector: string): HTMLElement | null {
        let foundElem: HTMLElement | null;
        while ($scope && $scope.parentNode && $scope != this.$el) {
            foundElem = $scope.parentNode.querySelector(selector);
            if (foundElem) {
                return foundElem;
            }
            $scope = $scope.parentNode;
        }
        return null;
    }

}