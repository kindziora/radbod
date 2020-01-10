import { kelement } from "../element.js";
export class input extends kelement {
    constructor(el, $scope, counter = 1, dom) {
        super(el, $scope, counter, dom);
        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
    /**
     *
     * @param change
     */
    render(change) {
        this.$el.outerHTML = `<input data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}
