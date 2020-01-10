import { kelement } from "../element.js";
export class button extends kelement {
    /**
       *
       * @param change
       */
    render(change) {
        this.$el.outerHTML = `<button data-name="${change.path}">${change.value}</button>`;
        return this.$el.outerHTML;
    }
}
