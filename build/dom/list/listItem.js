import { kelement } from "../element.js";
export class listItem extends kelement {
    render(change) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (this.template) {
            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toObject();
            if (typeof ((_c = this.getListContainer()) === null || _c === void 0 ? void 0 : _c.template) === "function") {
                let para = document.createElement("DIV");
                para.innerHTML = (((_d = this.getListContainer()) === null || _d === void 0 ? void 0 : _d.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t, env: (_e = this.dom.store) === null || _e === void 0 ? void 0 : _e.dataH.environment }))) + "").trim();
                //what about outerHTML?
                if (!(para === null || para === void 0 ? void 0 : para.firstChild)) {
                    change.op = "remove";
                    (_f = this.getListContainer()) === null || _f === void 0 ? void 0 : _f.remove(change);
                }
                else {
                    this.$el.innerHTML = (_h = (_g = para === null || para === void 0 ? void 0 : para.firstChild) === null || _g === void 0 ? void 0 : _g.innerHTML) === null || _h === void 0 ? void 0 : _h.trim();
                    (_k = (_j = this.dom.store) === null || _j === void 0 ? void 0 : _j.events) === null || _k === void 0 ? void 0 : _k.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });
                }
            }
            else {
                this.$el.innerHTML = (this.template.call(this, Object.assign(Object.assign({ change }, stores), { _t: this.dom._t, env: (_l = this.dom.store) === null || _l === void 0 ? void 0 : _l.dataH.environment })) + "").trim();
                (_o = (_m = this.dom.store) === null || _m === void 0 ? void 0 : _m.events) === null || _o === void 0 ? void 0 : _o.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });
            }
        }
        else {
            this.$el.innerHTML = change.value;
        }
    }
}
