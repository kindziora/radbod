import { list } from "../list.js";
export class checkbox extends list {
    /**
     *
     * @param single
     */
    getValue(single = false) {
        return this.getFields()
            .map((checkbox) => { return { "value": checkbox.value, "checked": checkbox.checked }; });
    }
    getFields() {
        return Array
            .from(this.$el.querySelectorAll(':scope input[type=checkbox]'));
    }
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
