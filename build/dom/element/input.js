import { kelement } from "../element.js";
export class input extends kelement {
    replace(change) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }
    add(change) {
        this.$el.setAttribute("value", change.value);
        this.$el.value = change.value;
    }
    /**
     *
     * @param change
     */
    render(change) {
        console.log("RENDER", change);
    }
}
