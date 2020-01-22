import {input} from "../input.js";

export class text extends input {
    
    /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input type="text" data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}