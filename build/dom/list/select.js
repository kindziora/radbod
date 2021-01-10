import { elist } from "../list.js";
export class select extends elist {
    /**
     *
     * @param value
     */
    renderItem(value) {
        var _a;
        return `<option data-type="list-item" data-index="${value.index}" data-name="${value.path}">${(_a = value === null || value === void 0 ? void 0 : value.html) === null || _a === void 0 ? void 0 : _a.trim()}</option>`;
    }
    /**
     *
     * @param change
     */
    render(change) {
        // this.$el.outerHTML = `<select data-type="list" data-name="${change.path}">${change.value.map(this.renderItem).join('')}</select>`;
        //return this.$el.outerHTML;
    }
}
