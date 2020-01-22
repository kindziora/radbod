import {input} from "../input.js";

export class file extends input {
      /**
     * 
     * @param change 
     */
    render(change: op){
        this.$el.outerHTML = `<input type="file" data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}