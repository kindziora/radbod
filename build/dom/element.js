export class kelement {
    constructor(el, $scope, counter = 1) {
        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
    getValue() {
    }
    getName() {
        return this.$el.getAttribute('data-name');
    }
    setId(namesp = "", counter) {
        let id = namesp + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
}
