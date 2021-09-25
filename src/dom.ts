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
import { actions } from "./actions.js";


export class dom {
    public _area: HTMLElement = {} as HTMLElement;
    private _identifier: string = ':scope *';
    public componentList: { [index: string]: any } = {};
    public element: { [index: string]: kelement } = {};
    public elementByName: { [index: string]: Array<kelement> } = {};

    public elementTypes: { [index: string]: any } = { listItem, input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };

    public sharedComponents: { [index: string]: component } = {};

    public counter: number = 0;
    public id: string = "c-0";

    public name: string = "c-x";
    public template: Function;

    public views?: { [index: string]: Function };

    public store: store;
    public $el: HTMLElement;

    public translation: i18n;
    public _t: Function;

    public kelementBy$el: WeakMap<HTMLElement, kelement>;

    constructor(area: HTMLElement, types: { [index: string]: any }, s: store, views: { [index: string]: Function }, translation: i18n, counter: number = 0) {

        this._area = area as HTMLElement;
        this.$el = this._area;
        this.views = views;
        this.translation = translation;

        this._t = (text: string, lang?: string) => this.translation._t(text, lang);
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

        this._area.innerHTML = (this.template.call(this, { change: data, ...storeObject, _t: this._t, env: this.store?.dataH.environment }) + "").trim();

        this.kelementBy$el = new WeakMap();

        this.loadElements();

        this.store.events?.dispatchEvent(this.name, `/$${this.name}`, "post_render", { change: data, domScope: this.$el, readd: true }, storeObject);
        return this._area;
    }

    /**
     * 
     * @param types 
     */
    public addTypes(types: { [index: string]: any }) {
        for (let i in types) {
            try{
                if (typeof this.elementTypes[i] === "undefined") {
                    types[i].prototype = "component";
                    this.elementTypes[i] = types[i];
                    this.componentList[i] = types[i];
                }
            }catch(e){
                console.error("addTypes error Element:",i, e);
            }
           
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

    isPlainComponentObject(componentObject: Object | component): boolean {
        return typeof componentObject.getName === "undefined";
    }

    isElementComponent($el: Element): boolean {
        return this.elementTypes[this.mapField(<string>$el.tagName.toLowerCase(), $el)].prototype === "component";
    }

    addStyle(style: string): boolean {
        if (style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = style;
            this.$el.append(stEl);
            return true;
        }
        return false;
    }

    isBuildStagePlainHTML(componentObject: Object, name: string): boolean {

        if (componentObject.views) {
            if (typeof componentObject.views[name] === "function") {
                return false;
            }
            return true;
        } else {
            return true;
        }

    }

    /**
     * @TODO ermöglichen von server rendered und lazy rendered componenten + laden deren stores
     * @TODO aufräumen von build, browser und server side rendering codes
     * @TODO KOA anstatt express server implementieren
     * @TODO asynchrone / await componenten + stores
     * 
     * 
     * @param $el 
     * @param fieldTypeName 
     */
    createComponent(name: string, $el: Element, componentObject: Object, fromAppContext:boolean = false) {
 
        if (!this.isPlainComponentObject(componentObject)) {
            // is sharedComponent don't create just return
            if (!$el.firstChild) {
                $el.appendChild(componentObject.dom.$el);
            } else {
                $el.innerHTML = "";
            }

            return componentObject;
        }

        let s: store = this.store.dataH.store[name];
        if (!s) {
            try {
                s = componentObject?.data?.call(this.store.dataH, function (data) {
                    console.log(`Fetched data from Store ${name} loading from component`, data);
                });
            } catch (e) {
                s = this.store.dataH.store[name];
                console.log(e);
            }
        }

        if (!s.addValidations) {
            s = this.store.dataH.store[name];
        }

        this.translation.addTranslation(typeof componentObject.translations === "function" ? componentObject.translations.call() : componentObject.translations);

        s.addValidations(componentObject.validations);

        let storesObject = this.store.dataH?.store.toObject();

        let args = this.store.dataH?.store.keys();

        if (this.isBuildStagePlainHTML(componentObject, name)) {
            if (componentObject.html) {
                if(this.store.dataH.buildMode && componentObject.SSR === false && fromAppContext) {
                    $el.innerHTML = "";
                }else{
                    $el.innerHTML = componentObject.html.trim();
                }
            }
        } else {
            //render from prebuilt Templates
        
                $el.innerHTML = (componentObject.views[name].call(componentObject, { change: { value: "" }, ...storesObject, _t: this._t, env: this.store?.dataH.environment }) + "").trim();
            
        }

        for (let name in componentObject.components) {
            if (typeof componentObject.components[name] === "string") {
                let nameID = componentObject.components[name].split("#").length > 0 ? componentObject.components[name].split("#")[1] : componentObject.components[name];
                
                if(this.componentList[nameID]) {
                    componentObject.components[name] = this.componentList[nameID];
                } else{
                    componentObject.components[name] = this.componentList[componentObject.components[name]];
                }

                for(let i in this.sharedComponents) { 
                    componentObject.components[i] = this.sharedComponents[i];
                }

            }
        }

        let enrichedTypes = (componentObject?.components || {}); //{ ...this.componentList, ...(componentObject?.components || {}) }; //
 
        console.log("enrichedTypes", enrichedTypes);

        let ddom = new dom($el, enrichedTypes, s, componentObject?.views, this.translation, this.counter);
        ddom.sharedComponents = this.sharedComponents;
        ddom.name = name;

        $el.setAttribute("data-name", name);

        console.log("CREATE COMPONENT:", name, s, componentObject.views, componentObject);

        let iactions: actions;
        try {
            iactions = componentObject?.interactions?.call({ componentObject, dom: ddom });
        } catch (e) {
            console.log(e);
            iactions = {};
        }

        let newcomponent = new component(ddom, iactions);

        if (this.isBuildStagePlainHTML(componentObject, name)) {
            ddom.addStyle(componentObject?.style);
            newcomponent.dom.setTemplate(eval('(function (args) { let {change, ' + args + ', _t, env} = args; return `' + newcomponent.dom._area.innerHTML.trim() + '`})'));
        } else {
            newcomponent.dom.setTemplate(componentObject?.views[name]);
            ddom.addStyle(componentObject?.style);
        }

        if (typeof componentObject?.mounted === "function" && componentObject?.views?.[name]) {
            componentObject?.mounted.call(newcomponent);
        }

        newcomponent.plainObject = componentObject;

        return newcomponent;
    }

    private addValidators($el: Element) {

        if ($el.hasAttribute("data-validations") && $el.hasAttribute("data-name")) {

            let fieldPath: string = $el.getAttribute("data-name");

            let validators = $el.getAttribute("data-validations").split(",");

            let metaManager = this.store.getMetaState();
            let meta = metaManager.getMeta(fieldPath);
            let validations = this.store.getValidations();

            for (let i of validators) {
                if (typeof validations[i] === "function") {
                    meta.validators[i] = validations[i];
                } else {

                    console.error({
                        name: "ValidationException",
                        message: `Validator named "${i}" was not loaded for DataStore "${this.store.name}" `,
                        toString: function () {
                            return this.name + ": " + this.message;
                        }
                    });
                    
                }
            }
            metaManager.setMeta(fieldPath, meta);
        }
    }


    /**
     * 
     * @param $el 
     * @param currentIndex 
     */
    private createElement($el: Element, currentIndex: number): kelement {
        let fieldTypeName: string = this.mapField(<string>$el.tagName.toLowerCase(), $el);

        this.addValidators($el);

        return this.elementTypes[fieldTypeName].prototype === "component" ?
            this.createComponent(fieldTypeName.split("-")[0], $el, this.elementTypes[fieldTypeName]) :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views, this._t);
    }

    /**
     * 
     * @param t_el 
     */
    detectType(t_el: kelement) {

        if (!(t_el?.getName)) {
            console.log("t_el", t_el);
        }

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
    loadElement($el: Element, currentIndex?: number): kelement | undefined {

        if (!this.kelementBy$el.get($el)) {

            this.kelementBy$el.set($el, "loading");

            console.log("LOAD " + this.id, $el);

            let t_el: kelement = this.createElement($el, currentIndex + 1); //decorate and extend dom element

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
            if (this.kelementBy$el.get($el) !== "loading") {
                return this.kelementBy$el.get($el);
            } else {
                this.kelementBy$el.delete($el);
            }
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

        if (!$el?.hasAttribute("data-id") || $el?.getAttribute("data-id")?.indexOf(this.name) !== -1
            || this.isElementComponent($el)
            || ($el.hasAttribute("data-name") && $el.getAttribute("data-name")?.indexOf("/_state") !== -1)) {
            this.counter++;

            return this.loadElement($el, currentIndex);
        }

    }

    loadElementsScoped($scope: Element): kelement[] {
        if (!this._area.contains($scope)) {
            return [];
        }

        let loaded: kelement[] = [];
        let element: NodeListOf<Element> = $scope.querySelectorAll(this._identifier) as NodeListOf<Element>;

        try {

            loaded = Array.from(element).map(($el: Element, currentIndex: number) => this._load($el, this.counter)).filter(e => e);

            let l = this._load($scope, this.counter);
            if (l) loaded.push(l);

        } catch (e) {
            console.log("FIELD NOT LOADED ERROR:", e);
        }
        return loaded;
    }

    loadElements() {

        let element: NodeListOf<Element> = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;

      
        element.forEach(($el: Element, currentIndex: number) => {
            try {
                this._load($el, currentIndex);
            } catch (e) {
                console.log(e);
            }
        });
      
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