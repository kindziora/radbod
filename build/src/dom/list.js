import { kelement } from "./element.js";
export class list extends kelement {
    constructor() {
        super(...arguments);
        this._listItems = [];
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
        let mappedItems = [];
        let items = this.getNativeListItems();
        for (let e in items) {
            let id = (_a = items[e]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
            if (id in this.dom.element) {
                mappedItems.push(this.dom.element[id]);
                this._listItems.push(this.dom.element[id]);
            }
            else {
                let nelement = this.dom.loadElement(items[e]);
                if (nelement) {
                    mappedItems.push(nelement);
                    this._listItems.push(nelement);
                }
            }
        }
        return mappedItems;
    }
    replace(value) {
        this.$el.value = value;
    }
    add(value) {
        this.$el.value = value;
    }
    remove(change) {
        super.remove(change);
    }
    render(value) {
        return value;
    }
}
