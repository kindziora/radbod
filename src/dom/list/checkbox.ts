import { list } from "../list.js";

export class checkbox extends list {

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
    
    render(value: any){

        return value;
    }
    

}