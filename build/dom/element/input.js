import { kelement } from "../element.js";
export class input extends kelement {
    constructor(el, $scope, counter = 1, dom) {
        super(el, $scope, counter, dom);
        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
}
