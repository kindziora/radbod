export class kelement {
    /**
     *
     * @param el
     * @param $scope
     * @param counter
     * @param dom
     */
    constructor(el, $scope, counter, dom, views) {
        var _a, _b, _c, _d, _e, _f, _g;
        this._isListItem = false;
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        this.setId(this.$el.getAttribute('data-id') || null, counter);
        this.setTemplate((_a = views) === null || _a === void 0 ? void 0 : _a[this.id]);
        if (!this.$el.hasAttribute("data-view")) {
            this.$el.setAttribute("data-view", this.id);
            if (!((_b = views) === null || _b === void 0 ? void 0 : _b[this.id])) {
                let stores = (_e = (_d = (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.dataH) === null || _d === void 0 ? void 0 : _d.store.keys()) === null || _e === void 0 ? void 0 : _e.join(',');
                console.log('(change, ' + stores + ', _t ) => `' + ((_f = this.$el.innerHTML) === null || _f === void 0 ? void 0 : _f.trim()) + '`');
                if (this.$el.innerHTML.trim() !== "")
                    this.setTemplate(eval('(change, ' + stores + ', _t) => `' + ((_g = this.$el.innerHTML) === null || _g === void 0 ? void 0 : _g.trim()) + '`'));
            }
        }
    }
    getValue() {
        return this.$el.value;
    }
    getName() {
        return this.$el.getAttribute('data-name');
    }
    setId(namesp, counter) {
        let id = namesp || "element" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            console.log(change.op, change.value);
            if (typeof this[change.op] !== "undefined") {
                this[change.op](change);
            }
        }
    }
    setTemplate(template) {
        this.template = template;
    }
    /**
     * !!caution this is slow and overwrites the hole html of the $element
     * @param data
     */
    render(change) {
        var _a, _b;
        if (this.template) {
            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toArray();
            this.$el.innerHTML = this.template.apply(this, [change, ...stores, this.dom._t]);
        }
        else {
            this.$el.innerHTML = change.value;
        }
    }
    replace(change) {
        this.render(change);
    }
    add(change) {
        this.render(change);
    }
    remove(change) {
        var _a;
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        if (this.isListItem()) {
            (_a = this.getListContainer()) === null || _a === void 0 ? void 0 : _a.remove(change);
        }
        else {
            this.$el.remove();
        }
    }
    isListItem() {
        return this._isListItem;
    }
    setIsListItem(value) {
        this._isListItem = value;
    }
    getListContainer() {
        return this._listContainer;
    }
    setListContainer(value) {
        this._listContainer = value;
    }
}
