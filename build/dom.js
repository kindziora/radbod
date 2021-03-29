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
export class dom {
    constructor(area, types, s, views, translation, counter = 0) {
        this._area = {};
        this._identifier = ':scope *';
        this.componentList = {};
        this.element = {};
        this.elementByName = {};
        this.elementTypes = { listItem, input, text, radio, checkbox, range, file, button, list: elist, select, textarea, kelement };
        this.counter = 0;
        this.id = "c-0";
        this.name = "c-x";
        this._area = area;
        this.$el = this._area;
        this.views = views;
        this.translation = translation;
        this._t = (text, lang) => this.translation._t(text, lang);
        this.kelementBy$el = new WeakMap();
        if (area.hasAttribute('data-name')) {
            this.name = area.getAttribute('data-name');
        }
        else {
            this.name = area === null || area === void 0 ? void 0 : area.tagName;
        }
        this._identifier = `:scope *`;
        this.counter = counter;
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
        var _a, _b, _c;
        this.element = {};
        this.elementByName = {};
        let storeObject = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        this._area.innerHTML = (this.template.call(this, Object.assign(Object.assign({ change: data }, storeObject), { _t: this._t, env: (_b = this.store) === null || _b === void 0 ? void 0 : _b.dataH.environment })) + "").trim();
        this.kelementBy$el = new WeakMap();
        this.loadElements();
        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.dispatchEvent(this.name, `/$${this.name}`, "post_render", { change: data, domScope: this.$el, readd: true }, storeObject);
        return this._area;
    }
    /**
     *
     * @param types
     */
    addTypes(types) {
        for (let i in types) {
            if (typeof this.elementTypes[i] === "undefined") {
                types[i].prototype = "component";
                this.elementTypes[i] = types[i];
                this.componentList[i] = types[i];
            }
        }
    }
    setId() {
        let id = this.name || "c" + "-" + this.counter;
        this._area.setAttribute("data-id", id);
        this.id = id;
        this.counter++;
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
        if (($element === null || $element === void 0 ? void 0 : $element.getAttribute('data-type')) == "list-item") {
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
    insertElementByElement(el, where = 'beforeend', html) {
        var _a;
        (_a = el.$el) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(where, html);
    }
    isPlainComponentObject(componentObject) {
        return typeof componentObject.getName === "undefined";
    }
    isElementComponent($el) {
        return this.elementTypes[this.mapField($el.tagName.toLowerCase(), $el)].prototype === "component";
    }
    addStyle(style) {
        if (style) {
            let stEl = document.createElement('style');
            stEl.innerHTML = style;
            this.$el.append(stEl);
            return true;
        }
        return false;
    }
    isBuildStagePlainHTML(componentObject, name) {
        if (componentObject.views) {
            if (typeof componentObject.views[name] === "function") {
                return false;
            }
            return true;
        }
        else {
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
    createComponent(name, $el, componentObject) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.isPlainComponentObject(componentObject)) {
            // is sharedComponent don't create just return
            if (!$el.firstChild) {
                $el.appendChild(componentObject.dom.$el);
            }
            else {
                $el.innerHTML = "";
            }
            return componentObject;
        }
        let s = this.store.dataH.store[name];
        if (!s) {
            try {
                s = (_a = componentObject === null || componentObject === void 0 ? void 0 : componentObject.data) === null || _a === void 0 ? void 0 : _a.call(this.store.dataH, function (data) {
                    console.log(`Fetched data from Store ${name} loading from component`, data);
                });
            }
            catch (e) {
                s = this.store.dataH.store[name];
                console.log(e);
            }
        }
        if (!s.addValidations) {
            s = this.store.dataH.store[name];
        }
        this.translation.addTranslation(typeof componentObject.translations === "function" ? componentObject.translations.call() : componentObject.translations);
        s.addValidations(componentObject.validations);
        let storesObject = (_b = this.store.dataH) === null || _b === void 0 ? void 0 : _b.store.toObject();
        let args = (_c = this.store.dataH) === null || _c === void 0 ? void 0 : _c.store.keys();
        if (this.isBuildStagePlainHTML(componentObject, name)) {
            if (componentObject.html) {
                $el.innerHTML = componentObject.html.trim();
            }
        }
        else {
            //render from prebuilt Templates
            $el.innerHTML = (componentObject.views[name].call(componentObject, Object.assign(Object.assign({ change: { value: "" } }, storesObject), { _t: this._t, env: (_d = this.store) === null || _d === void 0 ? void 0 : _d.dataH.environment })) + "").trim();
        }
        for (let name in componentObject.components) {
            if (typeof componentObject.components[name] === "string") {
                let nameID = componentObject.components[name].split("#").length > 0 ? componentObject.components[name].split("#")[1] : componentObject.components[name];
                componentObject.components[name] = this.componentList[nameID];
            }
        }
        let enrichedTypes = ((componentObject === null || componentObject === void 0 ? void 0 : componentObject.components) || {}); //{ ...this.componentList, ...(componentObject?.components || {}) };
        console.log("enrichedTypes", enrichedTypes);
        let ddom = new dom($el, enrichedTypes, s, componentObject === null || componentObject === void 0 ? void 0 : componentObject.views, this.translation, this.counter);
        ddom.name = name;
        $el.setAttribute("data-name", name);
        console.log("CREATE COMPONENT:", name, s, componentObject.views, componentObject);
        let iactions;
        try {
            iactions = (_e = componentObject === null || componentObject === void 0 ? void 0 : componentObject.interactions) === null || _e === void 0 ? void 0 : _e.call({ componentObject, dom: ddom });
        }
        catch (e) {
            console.log(e);
            iactions = {};
        }
        let newcomponent = new component(ddom, iactions);
        if (this.isBuildStagePlainHTML(componentObject, name)) {
            ddom.addStyle(componentObject === null || componentObject === void 0 ? void 0 : componentObject.style);
            newcomponent.dom.setTemplate(eval('(function (args) { let {change, ' + args + ', _t, env} = args; return `' + newcomponent.dom._area.innerHTML.trim() + '`})'));
        }
        else {
            newcomponent.dom.setTemplate(componentObject === null || componentObject === void 0 ? void 0 : componentObject.views[name]);
            ddom.addStyle(componentObject === null || componentObject === void 0 ? void 0 : componentObject.style);
        }
        if (typeof (componentObject === null || componentObject === void 0 ? void 0 : componentObject.mounted) === "function" && ((_f = componentObject === null || componentObject === void 0 ? void 0 : componentObject.views) === null || _f === void 0 ? void 0 : _f[name])) {
            componentObject === null || componentObject === void 0 ? void 0 : componentObject.mounted.call(newcomponent);
        }
        return newcomponent;
    }
    addValidators($el) {
        if ($el.hasAttribute("data-validations") && $el.hasAttribute("data-name")) {
            let fieldPath = $el.getAttribute("data-name");
            let validators = $el.getAttribute("data-validations").split(",");
            let metaManager = this.store.getMetaState();
            let meta = metaManager.getMeta(fieldPath);
            let validations = this.store.getValidations();
            for (let i of validators) {
                if (typeof validations[i] === "function") {
                    meta.validators[i] = validations[i];
                }
                else {
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
    createElement($el, currentIndex) {
        let fieldTypeName = this.mapField($el.tagName.toLowerCase(), $el);
        this.addValidators($el);
        return this.elementTypes[fieldTypeName].prototype === "component" ?
            this.createComponent(fieldTypeName.split("-")[0], $el, this.elementTypes[fieldTypeName]) :
            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views, this._t);
    }
    /**
     *
     * @param t_el
     */
    detectType(t_el) {
        var _a, _b, _c, _d, _e;
        if (!(t_el === null || t_el === void 0 ? void 0 : t_el.getName)) {
            console.log("t_el", t_el);
        }
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
        if (!this.kelementBy$el.get($el)) {
            this.kelementBy$el.set($el, "loading");
            console.log("LOAD " + this.id, $el);
            let t_el = this.createElement($el, currentIndex + 1); //decorate and extend dom element
            this.detectType(t_el);
            this.addElement(t_el);
            if (t_el.getName()) {
                this.addElementByName(t_el, t_el.getName());
            }
            else {
                this.detectOrphanVariables(t_el)
                    .forEach(name => this.addElementByName(t_el, name));
            }
            this.kelementBy$el.set($el, t_el);
            return t_el;
        }
        else {
            if (this.kelementBy$el.get($el) !== "loading") {
                return this.kelementBy$el.get($el);
            }
            else {
                this.kelementBy$el.delete($el);
            }
        }
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
    _load($el, currentIndex) {
        var _a, _b;
        if (!($el === null || $el === void 0 ? void 0 : $el.hasAttribute("data-id")) || ((_a = $el === null || $el === void 0 ? void 0 : $el.getAttribute("data-id")) === null || _a === void 0 ? void 0 : _a.indexOf(this.name)) !== -1
            || this.isElementComponent($el)
            || ($el.hasAttribute("data-name") && ((_b = $el.getAttribute("data-name")) === null || _b === void 0 ? void 0 : _b.indexOf("/_state")) !== -1)) {
            this.counter++;
            return this.loadElement($el, currentIndex);
        }
    }
    loadElementsScoped($scope) {
        if (!this._area.contains($scope)) {
            return [];
        }
        let loaded = [];
        let element = $scope.querySelectorAll(this._identifier);
        try {
            loaded = Array.from(element).map(($el, currentIndex) => this._load($el, this.counter)).filter(e => e);
            let l = this._load($scope, this.counter);
            if (l)
                loaded.push(l);
        }
        catch (e) {
            console.log("FIELD NOT LOADED ERROR:", e);
        }
        return loaded;
    }
    loadElements() {
        let element = this._area.querySelectorAll(this._identifier);
        element.forEach(($el, currentIndex) => {
            try {
                this._load($el, currentIndex);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    _removeElement(el) {
        delete this.element[el.id];
        let name = el.getName();
        if (typeof this.elementByName[name] !== "undefined") {
            this.elementByName[name] = this.elementByName[name].filter(function (element) {
                return element.id !== el.id;
            });
        }
        this.kelementBy$el.delete(el.$el);
        el.$el.remove();
    }
    removeElement(el) {
        let children = el.$el.querySelectorAll(this._identifier);
        try {
            children.forEach(($el, currentIndex) => this._removeElement(this.kelementBy$el.get($el)));
        }
        catch (e) {
            console.log(e);
        }
        this._removeElement(el);
    }
    addElement(el) {
        this.element[el.id] = el;
    }
    addElementByName(el, name) {
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
    getBestMatchingElements(path, searchAncestors = true) {
        let elements = [];
        if (typeof this.elementByName[path] !== "undefined") {
            return this.elementByName[path];
        }
        else if (searchAncestors) {
            let parentPath = path.split("/");
            if (parentPath.length > 1) {
                parentPath.pop();
                elements = this.getBestMatchingElements(parentPath.join('/'));
            }
        }
        return elements;
    }
    findMatchingElements(path) {
        let onlyListContainer = [];
        let elementsDetailedMatch = this.getBestMatchingElements(path);
        let ArrayParentPath = this.getArrayParentPath(path);
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
    getArrayParentPath(path) {
        let parts = path.split("/");
        for (let i in parts) {
            if (parseInt(parts[i]) == parts[i]) {
                parts.splice(i);
                break;
            }
        }
        return parts.join("/");
    }
    getArrayItemPath(path) {
        let parts = path.split("/");
        for (let i in parts) {
            if (parseInt(parts[i]) == parts[i]) {
                return parts.splice(0, parseInt(i) + 1).join("/");
            }
        }
        return parts.join("/");
    }
    pathContainsArray(path) {
        return this.getArrayParentPath(path) !== path;
    }
    getParents($scope, selector) {
        let foundElem;
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
