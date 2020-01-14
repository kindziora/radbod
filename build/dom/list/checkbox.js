import { elist } from "../list.js";
export class checkbox extends elist {
    /**
     *
     * @param single
     */
    getValue(single = false) {
        return this.getFields()
            .map((kcheckbox) => { return { "value": kcheckbox.$el.value, "checked": kcheckbox.$el.checked }; });
    }
    getFields() {
        return this.dom.getBestMatchingElements(this.getName());
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
    /**
     *
     * @param change
     */
    render(change) {
        let items = this.getListItems();
        // `<div data-type="list" data-name="${change.path}">${change.value.map(this.renderItem).join('')}</div>`;
    }
}
