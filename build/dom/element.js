;
export class kelement {
    constructor(el, $scope, counter = 1) {
        this.$el = el;
        this.$scope = $scope;
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
    replace(value) {
        this.$el.value = value;
    }
    add(value) {
        this.$el.value = value;
    }
    remove() {
        this.$el.value = "";
    }
}
