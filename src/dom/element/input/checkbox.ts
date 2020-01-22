import { input } from "../input.js";

export class checkbox extends input {

      /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input type="checkbox" data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }

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
    
   

}