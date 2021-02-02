import { kelement } from "../element.js";
export class listItem extends kelement {
    render(change) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (this.template) {
            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toObject();
            if (typeof ((_c = this.getListContainer()) === null || _c === void 0 ? void 0 : _c.template) === "function") {
                let para = document.createElement("DIV");
                para.innerHTML = (_d = this.getListContainer()) === null || _d === void 0 ? void 0 : _d.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t })).trim();
                //what about outerHTML?
                if (!(para === null || para === void 0 ? void 0 : para.firstChild)) {
                    change.op = "remove";
                    (_e = this.getListContainer()) === null || _e === void 0 ? void 0 : _e.remove(change);
                }
                else {
                    this.$el.innerHTML = (_g = (_f = para === null || para === void 0 ? void 0 : para.firstChild) === null || _f === void 0 ? void 0 : _f.innerHTML) === null || _g === void 0 ? void 0 : _g.trim();
                }
            }
            else {
                this.$el.innerHTML = this.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t })).trim();
            }
            (_j = (_h = this.dom.store) === null || _h === void 0 ? void 0 : _h.events) === null || _j === void 0 ? void 0 : _j.dispatchEvent(this.dom.name, this.dom.name, "post_render", { change: change, domScope: this.$el });
        }
        else {
            this.$el.innerHTML = change.value;
        }
    }
}
