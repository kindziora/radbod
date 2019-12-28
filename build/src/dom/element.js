export class kelement {
    /**
     *
     * @param el
     * @param $scope
     * @param counter
     * @param dom
     */
    constructor(el, $scope, counter = 1, dom) {
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
    render(value) {
        return value;
    }
    replace(value) {
        this.$el.value = this.render(value);
    }
    add(value) {
        this.$el.value = this.render(value);
    }
    remove() {
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        this.$el.value = this.render("");
    }
}
