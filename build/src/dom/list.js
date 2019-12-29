import { kelement } from "./element.js";
export class list extends kelement {
    constructor() {
        super(...arguments);
        this._listItems = {};
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
            }
            else {
                let nelement = this.dom.loadElement(items[e]);
                if (nelement) {
                    mappedItems[nelement.id] = nelement;
                    this._listItems[nelement.id] = nelement;
                }
            }
        }
        return mappedItems;
    }
    replace(change) {
        this.$el.value = value;
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
            if (pos > 0 && pos > Object.keys(items).length - 1) {
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
            //inserted in between
            if (pos > 0 && pos < Object.keys(items).length - 1) {
                let el = (_c = change.path) === null || _c === void 0 ? void 0 : _c.split("/");
                el.pop();
                el.push(pos + 1);
                where = "afterend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
        }
        else {
            console.log("fail pointer from path", change.path);
        }
    }
    remove(change) {
        var _a;
        super.remove(change);
        let el = (_a = this.dom.getBestMatchingElements(change.path)) === null || _a === void 0 ? void 0 : _a.pop();
        if (el)
            this.dom.removeElement(el);
    }
    renderItem(value) {
        var _a, _b;
        return `<div data-type="list-item" data-name="${value.path}">${(_b = (_a = value) === null || _a === void 0 ? void 0 : _a.html) === null || _b === void 0 ? void 0 : _b.trim()}</div>`;
    }
}
