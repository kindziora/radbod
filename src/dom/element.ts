import { op } from "../store.js";
import { dom } from "../dom.js";

export class kelement {

    public id: string;
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
     constructor(el: HTMLElement, $scope: HTMLElement, counter: number, dom:dom, views?: { [index: string]: Function }) {
        this.$el = el;
        this.$scope = $scope;
        this.dom = dom;
        
        if(!this.$el.getAttribute("data-id")){
            this.setId(null, counter);
        }else{ 
            this.id = this.$el.getAttribute('data-id');
        }

        if(views?.[this.$el.getAttribute('data-view')]){
            this.setTemplate(views?.[this.$el.getAttribute('data-view')]);
        }else{
            if(!views?.[this.id]){ 

                let args = this.dom.store?.dataH?.store.keys();
    
                if(this.$el.innerHTML.trim() !==""){
                     this.setTemplate(eval('(args)=> { let {change, ' + args +', _t} = args; return `'+ this.$el.innerHTML?.trim() +'`}')); 
                }
            }else{
                this.setTemplate(views?.[this.id]);
            }
        }
 
        if(!this.$el.hasAttribute("data-view")){
            this.$el.setAttribute("data-view", this.id); 
        }

    }

    public getValue() {
        return this.$el.value;
    }

    public getName() {
        return this.$el.getAttribute('data-name');
    }

    setId(namesp: string | null, counter: number) {
        let id: string = namesp || this.$scope.getAttribute('data-id') + "-e" + "-" + counter;
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
            let stores = this.dom.store?.dataH?.store.toObject();
            
            this.$el.innerHTML = this.template.call(this, {change, ...stores, _t : this.dom._t}); 

            this.dom.store?.events?.dispatchEvent(this.dom.name, this.dom.name, "post_render", { change: change, domScope: this.$el});
            
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