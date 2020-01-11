import { kelement } from "../element.js";
export class input extends kelement {
    /**
     *
     * @param change
     */
    render(change) {
        this.$el.outerHTML = `<input data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}
