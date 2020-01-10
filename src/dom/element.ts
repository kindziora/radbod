import { op } from "../store.js";
import { domHandler } from "../domHandler.js";

export class kelement {

    public id: String;
    public $el: HTMLElement;
    public $scope: HTMLElement;
    public dom: domHandler;
    private _isListItem: boolean = false;
    private _listContainer: kelement | null;

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

    setId(namesp: string = "element", counter: number) {
        let id: string = "element" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    update(changes: Array<op>) {

        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];
            console.log(change.op, change.value);
            if (typeof this[change.op] !== "undefined") {
                this[change.op](change.value); 
            }
        }
        
    }

    render(change: op){
        return change.value;
    }

    replace(change: op) {
        this.$el.value = this.render(change.value);
    }

    add(change: op) {
        this.$el.value = this.render(change.value);
    }

    remove(change: op) {
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        if(this.isListItem()){
            this.getListContainer()?.remove(change);
        }else{
            this.$el.value = this.render("");
        }
    }

    isListItem():boolean{
        return this._isListItem;
    }

    setIsListItem(value: boolean){
        this._isListItem = value;
    }

    getListContainer(){
        return this._listContainer;
    }

    setListContainer(value: kelement){
        this._listContainer = value;
    }
}