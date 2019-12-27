import { list } from "../list.js";

export class checkbox extends list {

    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {

        return this.getFields()
            .map((checkbox) => { return {"value": checkbox.value, "checked" : checkbox.checked}});
    }

    getFields(){
        return Array
            .from(this.$el.querySelectorAll(':scope input[type=checkbox]'));
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