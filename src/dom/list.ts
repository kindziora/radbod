import {kelement} from "./element.js";
import { domHandler } from "../domHandler.js";
import { datastore, op } from '../datastore';

export class list extends kelement{


    private _listItems : Array<kelement> = [];

    getNativeListItems(): HTMLCollection{
        return this.$el?.children as HTMLCollection;
    }

    getListItems(cached:boolean = false){
        return cached ?this._listItems :this.mapListItems();
    }

    mapListItems(): Array<kelement> | []{
        let mappedItems: Array<kelement> = [];
        let items = this.getNativeListItems();
        for(let e in items){
            let id = items[e]?.getAttribute("data-id");

            if(id in this.dom.element){
                mappedItems.push(this.dom.element[id]);
                this._listItems.push(this.dom.element[id]);
            }else{
                let nelement = this.dom.loadElement(items[e]);
                if(nelement){
                    mappedItems.push(nelement);
                    this._listItems.push(nelement);
                }
            }
        }
        return mappedItems;
    }

    replace(value: any) {
        this.$el.value = value;
    }

    add(value: any) {
        this.$el.value = value;
    }

    remove(change: op) {
       super.remove(change);

       
    }
    
    render(value: any){

        return value;
    }
    
}