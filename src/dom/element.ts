import { op } from "../store.js";
import { dom } from "../dom.js";

export class kelement {

    public id: String;
    public $el: HTMLElement;
    public $scope: HTMLElement;
    public dom: dom;
    private _isListItem: boolean = false;
    private _listContainer: kelement | null;

    public template: Function;

    /**
     * 
     * @param el 
     * @param $scope 
     * @param counter 
     * @param dom 
     */
    constructor(el: HTMLElement, $scope: HTMLElement, counter: number = 1, dom:dom, template:Function) {
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        this.setId(this.$el.getAttribute('data-id') || null, counter);

        this.setTemplate(template);
    }

    public getValue() {
        return this.$el.value;
    }

    public getName() {
        return this.$el.getAttribute('data-name');
    }

    setId(namesp: string | null, counter: number) {
        let id: string = namesp || "element" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    update(changes: Array<op>) {

        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];
            console.log(change.op, change.value);
            if (typeof this[change.op] !== "undefined") {
                this[change.op](change); 
            }
        }
        
    }

    setTemplate(template: Function) {
        this.template = template;
    }

    /**
     * !!caution this is slow and overwrites the hole html of the $element
     * @param data 
     */
    render(change: op){
        if(this.template){
            this.$el.innerHTML = this.template(change);
        }else{
            this.$el.innerHTML = change.value; 
        }
    }

    replace(change: op) {
       this.render(change);
    }

    add(change: op) {
        this.render(change);
    }

    remove(change: op) {
        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el
        if(this.isListItem()){
            this.getListContainer()?.remove(change);
        }else{
            this.$el.remove();
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