import {kelement, op} from "../element.js";

export class input extends kelement {

    public $el: HTMLInputElement;
    
    constructor(el: HTMLInputElement, $scope: HTMLElement, counter:number = 1, dom:domHandler) {
        super(el, $scope, counter, dom);

        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
    

   

}

