import { elist } from "../list.js";
import { op } from "../../store.js";

export class checkbox extends elist {

    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {

        return this.getFields()
            .map((kcheckbox) => { return {"value": kcheckbox.$el.value, "checked" : kcheckbox.$el.checked}});
    }

    getFields(){
        return this.dom.getBestMatchingElements(<string>this.getName());
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
    
   
    /**
     * 
     * @param change 
     */
    render(change: op) {
        let items = this.getListItems();

        // `<div data-type="list" data-name="${change.path}">${change.value.map(this.renderItem).join('')}</div>`;
        
    }
    

}