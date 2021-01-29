import { kelement } from "../element.js";
import { op } from "../../store.js";

export class listItem extends kelement {
    
    render(change: op) {
        if (this.template) {
            let stores = this.dom.store?.dataH?.store.toObject();
 
            if(typeof this.getListContainer()?.template ==="function") {
                this.$el.outerHTML = this.getListContainer()?.template.call(this, { change, ...stores, _t: this.dom._t });
            }else{
                this.$el.innerHTML = this.template.call(this, { change, ...stores, _t: this.dom._t });
            } 
            this.dom.store?.events?.dispatchEvent(this.dom.name, this.dom.name, "post_render", { change: change, domScope: this.$el });

        } else {
            this.$el.innerHTML = change.value;
        }
    }
}

