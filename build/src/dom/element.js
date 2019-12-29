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
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
    getValue() {
        return this.$el.value;
    }
    getName() {
        return this.$el.getAttribute('data-name');
    }
    setId(namesp = "", counter) {
        let id = namesp + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            if (typeof this[change.op] !== "undefined") {
                this[change.op](change.value);
            }
        }
    }
    render(change) {
        return change.value;
    }
    replace(change) {
        this.$el.value = this.render(change.value);
    }
    add(change) {
        this.$el.value = this.render(change.value);
    }
    remove(change) {
        var _a;
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        if (this.isListItem()) {
            (_a = this.getListContainer()) === null || _a === void 0 ? void 0 : _a.remove(change);
        }
        else {
            this.$el.value = this.render("");
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
