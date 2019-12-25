export class kelement {
    construct(el, $scope, counter = 1) {
        console.log("el", el, "scope", $scope, "counter", counter);
        /* this.$el = el;
         this.$scope = $scope;
         this.setId(this.$scope.getAttribute('data-id') || undefined, counter);*/
    }
    getValue() {
    }
    getName() {
        return "inputtest"; //this.$el.getAttribute('data-name');
    }
    setId(namesp = "", counter) {
        let id = namesp + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
}
