import { kelement } from "./element.js";
export class elist extends kelement {
    constructor() {
        super(...arguments);
        this._listItems = {};
        this._listItemsByName = {};
    }
    isListItem() {
        return true;
    }
    getNativeListItems() {
        var _a;
        return Array.from((_a = this.$el) === null || _a === void 0 ? void 0 : _a.children);
    }
    getListItems(cached = false) {
        return cached ? this._listItems : this.mapListItems();
    }
    mapListItems() {
        var _a;
        let mappedItems = {};
        let items = this.getNativeListItems();
        for (let e in items) {
            let id = typeof items[e] !== "undefined" ? (_a = items[e]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id") : "";
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
        this.render(change);
    }
    /**
     *
     * @TODO es fehlen teilweise elemente anch vielem hin und her geklicke
     *
     */
    add(change) {
        var _a, _b, _c, _d;
        let where = "afterbegin";
        let pointer = (_b = (_a = change.path) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop();
        if (!isNaN(pointer)) {
            let items = this.getListItems();
            let pos = parseInt(pointer);
            if (pos === 0) { // first added element
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
            //appendend to end
            if (pos !== 0 && pos > Object.keys(items).length - 1) {
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }
            //inserted in between
            if (pos > 0 && pos <= Object.keys(items).length - 1) {
                function walkUntilFound(dir, where) {
                    let inserted = false;
                    for (let i = pos; i >= 0; i = i + dir) {
                        let name = change.path.replace(/\d+(\D*)$/gm, i);
                        if (this._listItemsByName[name]) {
                            this.dom.insertElementByElement(this._listItemsByName[name], where, this.renderItem(change));
                            inserted = true;
                            break;
                        }
                    }
                    return inserted;
                }
                if (!walkUntilFound.call(this, -1, "afterend")) {
                    if (!walkUntilFound.call(this, 1, "afterend")) {
                    }
                }
            }
        }
        else {
            console.log("failed pointer from path", change.path);
        }
        let addedEl = this.$el.querySelector(`:scope [data-name="${CSS.escape(change.path)}"]`);
        let resultEL = null;
        if (addedEl)
            (_d = (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.events) === null || _d === void 0 ? void 0 : _d.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: addedEl });
        return resultEL;
    }
    remove(change) {
        // super.remove(change);
        this.mapListItems();
        if (typeof this._listItemsByName[change.path] !== "undefined") {
            this.dom.removeElement(this._listItemsByName[change.path]);
            delete this._listItems[this._listItemsByName[change.path].id];
            delete this._listItemsByName[change.path];
        }
    }
    /**
    * !!caution this is slow and overwrites the hole html of the $element
    * @param data
    */
    render(change) {
        var _a, _b;
        let items = JSON.parse(JSON.stringify(change.value || [])).filter((i) => !!i);
        this.$el.innerHTML = items.map((e, i) => this.renderItem({ op: "add", path: change.path + "/" + i, value: e })).join("\r\n").trim();
        (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });
    }
    /**
     *
     * @param value
     */
    renderItem(change) {
        var _a, _b, _c, _d;
        let pointer = (_b = (_a = change.path) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop();
        change.index = pointer;
        if (this.template) {
            let storeObject = (_d = (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.dataH) === null || _d === void 0 ? void 0 : _d.store.toObject();
            return this.template.call(this, Object.assign(Object.assign({ change }, storeObject), { _t: this.dom._t })).trim();
        }
        else {
            return `<div data-type="list-item" data-index="${pointer}" data-name="${change.path}">${change.value}</div>`;
        }
    }
}
