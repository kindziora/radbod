import { input } from "../input.js";

export class radio extends input {
      /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input type="radio" data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }

    /**
     * 
     * @param single 
     */
    public getValue(single:Boolean = false) {
        return this.$scope.querySelector(':scope input[data-name="' + this.getName() + '"]:checked')?.value;
    }
    
}