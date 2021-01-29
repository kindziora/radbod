import { kelement } from "../element.js";
import { op } from "../../store.js";

export class listItem extends kelement {
    
    render(change: op) {
        if (this.template) {
            let stores = this.dom.store?.dataH?.store.toObject();
 
            if(typeof this.getListContainer()?.template ==="function") {
                
                let para:HTMLElement = document.createElement("DIV"); 
                para.innerHTML = this.getListContainer()?.template.call(this, { change, ...stores, _t: this.dom._t }).trim();

                //what about outerHTML?

                this.$el.innerHTML = para?.firstChild?.innerHTML;

            }else{
                this.$el.innerHTML = this.template.call(this, { change, ...stores, _t: this.dom._t });
            } 

            this.dom.store?.events?.dispatchEvent(this.dom.name, this.dom.name, "post_render", { change: change, domScope: this.$el });

        } else {
            this.$el.innerHTML = change.value;
        }
    }
}

