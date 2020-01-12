export class kelement {
    /**
     *
     * @param el
     * @param $scope
     * @param counter
     * @param dom
     */
    constructor(el, $scope, counter = 1, dom) {
        this._isListItem = false;
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        this.setId(this.$el.getAttribute('data-id') || null, counter);
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
    /**
     *
     * @param change
     */
    render(change) {
        this.$el.outerHTML = `<div data-name="${change.path}">${change.value}</div>`;
        return this.$el.outerHTML;
    }
    replace(change) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }
    add(change) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }
    remove(change) {
        var _a;
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        if (this.isListItem()) {
            (_a = this.getListContainer()) === null || _a === void 0 ? void 0 : _a.remove(change);
        }
        else {
            this.$el.value = "";
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
