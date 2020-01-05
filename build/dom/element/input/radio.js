import { input } from "../input.js";
export class radio extends input {
    /**
     *
     * @param single
     */
    getValue(single = false) {
        var _a;
        return (_a = this.$scope.querySelector(':scope input[data-name="' + this.getName() + '"]:checked')) === null || _a === void 0 ? void 0 : _a.value;
    }
}
