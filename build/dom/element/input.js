import { kelement } from "../element.js";
export class input extends kelement {
    constructor(el, $scope, counter = 1) {
        super(el, $scope, counter);
        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
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
