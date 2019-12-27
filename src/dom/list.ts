import {kelement} from "./element.js";
import { domHandler } from "../domHandler.js";

export class list extends kelement{

    replace(value: any) {
        this.$el.value = value;
    }

    add(value: any) {
        this.$el.value = value;
    }

    remove() {
        this.$el.value = "";
    }
    
    render(value: any){

        return value;
    }
    
}