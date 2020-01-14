import { elist } from "../list.js";

export class select extends elist {
    /**
     * 
     * @param value 
     */
    renderItem(value: any): string {
        return `<option data-type="list-item" data-index="${value.index}" data-name="${value.path}">${value?.html?.trim()}</option>`;
    }
    /**
     * 
     * @param change 
     */
    render(change: op) {
       // this.$el.outerHTML = `<select data-type="list" data-name="${change.path}">${change.value.map(this.renderItem).join('')}</select>`;
        //return this.$el.outerHTML;
    }
}

