import { input } from "../input.js";

export class checkbox extends input {

    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {

        if(single) return super.getValue();

        return Array
            .from(this.$scope.querySelectorAll(':scope input[data-name="' + this.getName() + '"]:checked'))
            .map((checkbox) => checkbox.value);
    }

    
 

}