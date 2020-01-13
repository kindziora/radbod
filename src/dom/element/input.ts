import {kelement, op} from "../element.js";

export class input extends kelement {

    public $el: HTMLInputElement;
    
    replace(change: op) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }

    add(change: op) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }
    /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }


}

