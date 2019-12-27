import { input } from "../input.js";

export class checkbox extends input {

    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {

        if(single) return super.getValue();

        return this.getFields()
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);
    }

    getFields(){
        return Array
            .from(this.$scope.querySelectorAll(':scope input[data-name="' + this.getName() + '"]'));
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