import { input } from "../input.js";

export class radio extends input {
    
    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {
        return this.$scope.querySelector(':scope input[data-name="' + this.getName() + '"]:checked')?.value;
    }
    
}