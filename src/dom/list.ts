import {kelement} from "./element.js";

export class list {

    public id: String;
    public $el: HTMLElement;
    public $scope: HTMLElement;

    constructor(el: HTMLElement, $scope: HTMLElement, counter:number = 1) {
        this.$el = el;
        this.$scope = $scope;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }
 
    public getName(){
        return this.$el.getAttribute('data-name');
    }

    setId(namesp: string = "", counter:number) {
        let id: string = namesp+ "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    replace(value: any) {
        this.$el.value = value;
    }

    add(value: any) {
        this.$el.value = value;
    }

    remove() {
        this.$el.value = "";
    }
    
    render(value: any){

        return value;
    }
    
}