import {kelement, op} from "../element.js";

export class input extends kelement {

    public $el: HTMLInputElement;
    
    constructor(el: HTMLInputElement, $scope: HTMLElement, counter:number = 1) {
        super(el, $scope, counter);

        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
    

    update(changes: Array<op>){

       for(let i:number = 0; i < changes.length; i++){
           let change:op = changes[i];
            if(typeof this[change.op] !=="undefined"){
                this[change.op](change.value);
            }
       }
            
    }

    replace(value:any){
        this.$el.value = value;
    }

    add(value:any){
        this.$el.value = value;
    }

    remove(){
        this.$el.value = "";
    }

}

