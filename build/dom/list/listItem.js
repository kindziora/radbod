import { kelement } from "../element.js";
export class listItem extends kelement {
    render(change) {
        var _a, _b, _c, _d, _e, _f;
        if (this.template) {
            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toObject();
            if (typeof ((_c = this.getListContainer()) === null || _c === void 0 ? void 0 : _c.template) === "function") {
                this.$el.outerHTML = (_d = this.getListContainer()) === null || _d === void 0 ? void 0 : _d.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t }));
            }
            else {
                this.$el.innerHTML = this.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t }));
            }
            (_f = (_e = this.dom.store) === null || _e === void 0 ? void 0 : _e.events) === null || _f === void 0 ? void 0 : _f.dispatchEvent(this.dom.name, this.dom.name, "post_render", { change: change, domScope: this.$el });
        }
        else {
            this.$el.innerHTML = change.value;
        }
    }
}
