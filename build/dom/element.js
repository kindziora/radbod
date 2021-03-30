export class kelement {
    /**
     *
     * @param el
     * @param $scope
     * @param counter
     * @param dom
     */
    constructor(el, $scope, counter, dom, views) {
        var _a, _b, _c;
        this._isListItem = false;
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        if (!this.$el.hasAttribute("data-id")) {
            this.setId(null, counter);
        }
        else {
            this.id = this.$el.getAttribute('data-id');
        }
        if (views === null || views === void 0 ? void 0 : views[this.$el.getAttribute('data-view')]) {
            this.setTemplate(views === null || views === void 0 ? void 0 : views[this.$el.getAttribute('data-view')]);
            if (this.$el.hasAttribute('data-name')) {
                let c = this.dom.store.accessByPath(this.$el.getAttribute('data-name'));
                if (typeof c !== "undefined") {
                    this.render({ op: "add", path: this.$el.getAttribute('data-name'), value: c });
                }
            }
        }
        else {
            if (!(views === null || views === void 0 ? void 0 : views[this.id])) {
                if (this.$el.innerHTML.trim() !== "") {
                    let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.keys();
                    let FNC_STRING = '(function (args) { let {change, ' + stores + ', _t, env} = args; return `' + ((_c = this.$el.innerHTML) === null || _c === void 0 ? void 0 : _c.trim()) + '`})';
                    try {
                        this.setTemplate(eval(FNC_STRING));
                    }
                    catch (e) {
                        console.log("ERRORXX", e, FNC_STRING);
                    }
                }
            }
            else {
                this.setTemplate(views === null || views === void 0 ? void 0 : views[this.id]);
            }
        }
        if (!this.$el.hasAttribute("data-view")) {
            this.$el.setAttribute("data-view", this.id);
        }
    }
    getValue() {
        return this.$el.value;
    }
    validate() {
        if (this.$el.hasAttribute('data-name')) {
            return this.dom.store.validateField(this.getName(), this.getValue());
        }
    }
    getName() {
        return this.$el.getAttribute('data-name');
    }
    setId(namesp, counter) {
        let id = namesp || this.$scope.getAttribute('data-id') + "-e" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            console.log(change.op, change.value, this.$el);
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
        var _a, _b, _c, _d, _e;
        if (this.template) {
            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toObject();
            let newHTML = (this.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t, env: (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.dataH.environment })) + "").trim();
            if (this.$el.innerHTML !== newHTML) {
                this.$el.innerHTML = newHTML;
                if (this.$el.childElementCount > 0)
                    (_e = (_d = this.dom.store) === null || _d === void 0 ? void 0 : _d.events) === null || _e === void 0 ? void 0 : _e.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });
            }
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
