import { kelement } from "./element.js";
export class list extends kelement {
    constructor() {
        super(...arguments);
        this._listItems = {};
        this._listItemsByName = {};
    }
    getNativeListItems() {
        var _a;
        return (_a = this.$el) === null || _a === void 0 ? void 0 : _a.children;
    }
    getListItems(cached = false) {
        return cached ? this._listItems : this.mapListItems();
    }
    mapListItems() {
        var _a;
        let mappedItems = {};
        let items = this.getNativeListItems();
        for (let e in items) {
            let id = (_a = items[e]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
            if (id in this.dom.element) {
                mappedItems[id] = this.dom.element[id];
                this._listItems[id] = this.dom.element[id];
                this._listItemsByName[this.dom.element[id].getName()] = this.dom.element[id];
            }
            else {
                let nelement = this.dom.loadElement(items[e]);
                if (nelement) {
                    mappedItems[nelement.id] = nelement;
                    this._listItems[nelement.id] = nelement;
                    this._listItemsByName[nelement.getName()] = nelement;
                }
            }
        }
        return mappedItems;
    }
    replace(change) {
        console.log("replace whole list");
    }
    add(change) {
        var _a, _b, _c;
        let where = "afterbegin";
        let pointer = (_b = (_a = change.path) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop();
        if (!isNaN(pointer)) {
            let items = this.getListItems();
            let pos = parseInt(pointer);
            if (pos === 0) { // first added element
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
            //appendend to end
            if (pos > Object.keys(items).length - 1) {
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
            //inserted in between
            if (pos > 0 && pos < Object.keys(items).length - 1) {
                let tname = (_c = change.path) === null || _c === void 0 ? void 0 : _c.split("/");
                tname.pop();
                tname.push(pos - 1);
                let name = tname.join("/");
                where = "afterend";
                if (this._listItemsByName[name]) {
                    this.dom.insertElementByElement(this._listItemsByName[name], where, this.renderItem(change));
                }
                else {
                    console.log("failed to find point to insert list-item", name);
                }
            }
        }
        else {
            console.log("failed pointer from path", change.path);
        }
        let addedEl = this.$scope.querySelector(`:scope data-name="${change.path}"`);
        let resultEL = null;
        if (addedEl) {
            resultEL = this.dom.loadElement(addedEl);
        }
        return resultEL;
    }
    remove(change) {
        var _a;
        super.remove(change);
        let el = (_a = this.dom.getBestMatchingElements(change.path)) === null || _a === void 0 ? void 0 : _a.pop();
        if (el)
            this.dom.removeElement(el);
    }
    render() {
    }
    /**
     *
     * @param value
     */
    renderItem(value) {
        var _a, _b;
        return `<div data-type="list-item" data-index="${value.index}" data-name="${value.path}">${(_b = (_a = value) === null || _a === void 0 ? void 0 : _a.html) === null || _b === void 0 ? void 0 : _b.trim()}</div>`;
    }
}
