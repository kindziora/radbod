import {kelement} from "./element.js";
import { domHandler } from "../domHandler.js";
import { datastore, op } from '../datastore';

export class list extends kelement{

    private _listItems: { [index: string]: kelement } = {};

    getNativeListItems(): HTMLCollection{
        return this.$el?.children as HTMLCollection;
    }

    getListItems(cached:boolean = false){
        return cached ?this._listItems :this.mapListItems();
    }

    mapListItems(): { [index: string]: kelement }  | {} {
        let mappedItems: { [index: string]: kelement } = {};
        let items = this.getNativeListItems();
        for(let e in items){
            let id = items[e]?.getAttribute("data-id");

            if(id in this.dom.element){
                mappedItems[id] = this.dom.element[id];
                this._listItems[id] = this.dom.element[id];
            }else{
                let nelement = this.dom.loadElement(items[e]);
                if(nelement){
                    mappedItems[nelement.id] = nelement; 
                    this._listItems[nelement.id] = nelement;
                }
            }
        }
        return mappedItems;
    }

    replace(change: op) {
        this.$el.value = value;
    }

    add(change: op) {
        let where: InsertPosition = "afterbegin";
        let pointer = change.path?.split("/")?.pop();

        if(!isNaN(pointer)) {
            let items = this.getListItems();
            let pos: number = parseInt(pointer);
            
            if(pos === 0){ // first added element
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

            //appendend to end
            if(pos > 0 && pos > Object.keys(items).length - 1){ 
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

            //inserted in between
            if(pos > 0 && pos < Object.keys(items).length - 1){
                let el = change.path?.split("/");
                el.pop();
                el.push(pos + 1);
                where = "afterend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

           


            
        
        }else{
            console.log("fail pointer from path" , change.path);
        }
    }

    remove(change: op) {
       super.remove(change);
       let el = this.dom.getBestMatchingElements(change.path)?.pop();
       if(el)this.dom.removeElement(el);
    }
    
    renderItem(value: any): string {
        return `<div data-type="list-item" data-name="${value.path}">${value?.html?.trim()}</div>`;
    }
    
}