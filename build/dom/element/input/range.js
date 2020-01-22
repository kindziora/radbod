import { input } from "../input.js";
export class range extends input {
    /**
   *
   * @param change
   */
    render(change) {
        this.$el.outerHTML = `<input type="range" data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}
