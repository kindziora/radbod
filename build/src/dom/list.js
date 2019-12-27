import { kelement } from "./element.js";
export class list extends kelement {
    replace(value) {
        this.$el.value = value;
    }
    add(value) {
        this.$el.value = value;
    }
    remove() {
        this.$el.value = "";
    }
    render(value) {
        return value;
    }
}
