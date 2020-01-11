import {kelement, op} from "../element.js";

export class input extends kelement {

    public $el: HTMLInputElement;
    
    /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }


}

