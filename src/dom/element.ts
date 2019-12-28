import {datastore, op} from "../datastore";
import { domHandler } from "../domHandler.js";

export class kelement {

    public id: String;
    public $el: HTMLElement;
    public $scope: HTMLElement;
    public dom: domHandler;

    /**
     * 
     * @param el 
     * @param $scope 
     * @param counter 
     * @param dom 
     */
    constructor(el: HTMLElement, $scope: HTMLElement, counter: number = 1, dom:domHandler) {
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
    }

    public getValue() {
        return this.$el.value;
    }

    public getName() {
        return this.$el.getAttribute('data-name');
    }

    setId(namesp: string = "", counter: number) {
        let id: string = namesp + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    update(changes: Array<op>) {

        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];
            if (typeof this[change.op] !== "undefined") {
                this[change.op](change.value);
            }
        }

    }

    render(value: any){

        return value;
    }

    replace(value: any) {
        this.$el.value = this.render(value);
    }

    add(value: any) {
        this.$el.value = this.render(value);
    }

    remove() {
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el

        this.$el.value = this.render("");
    }

}