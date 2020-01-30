import { kelement } from "./element.js";
import { dom } from "../dom.js";
import { op } from '../store.js';

export class elist extends kelement {

    private _listItems: { [index: string]: kelement } = {};
    private _listItemsByName: { [index: string]: kelement } = {};


    isListItem(): boolean {
        return true;
    }

    getNativeListItems(): HTMLCollection {
        return this.$el ?.children as HTMLCollection;
    }

    getListItems(cached: boolean = false) {
        return cached ? this._listItems : this.mapListItems();
    }

    mapListItems(): { [index: string]: kelement } | {} {
        let mappedItems: { [index: string]: kelement } = {};
        let items = this.getNativeListItems();
        for (let e in items) {
            let id = items[e] ?.getAttribute("data-id");

            if (id in this.dom.element) {
                mappedItems[id] = this.dom.element[id];
                this._listItems[id] = this.dom.element[id];
                this._listItemsByName[this.dom.element[id].getName()] = this.dom.element[id];

            } else {
                let nelement = this.dom.loadElement(items[e]);
                if (nelement) {
                    mappedItems[nelement.id] = nelement;
                    this._listItems[nelement.id] = nelement;
                    this._listItemsByName[nelement.getName()] = nelement;
                }
            }
        }
        return mappedItems;
    }

    replace(change: op) {
        console.log("replace whole list");
    }

    add(change: op): kelement | null {
        let where: InsertPosition = "afterbegin";
        let pointer = change.path?.split("/")?.pop();

        if (!isNaN(pointer)) {
            let items = this.getListItems();
            let pos: number = parseInt(pointer);

            if (pos === 0) { // first added element
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

            //appendend to end
            if (pos > Object.keys(items).length - 1) {
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

            //inserted in between
            if (pos > 0 && pos < Object.keys(items).length - 1) {
                let tname = change.path ?.split("/");
                tname.pop();
                tname.push(pos - 1);
                let name = tname.join("/");
                where = "afterend";
                if (this._listItemsByName[name]) {
                    this.dom.insertElementByElement(this._listItemsByName[name], where, this.renderItem(change));
                } else {
                    console.log("failed to find point to insert list-item", name);
                }
            }

        } else {
            console.log("failed pointer from path", change.path);
        }
        let addedEl = this.$scope.querySelector(`:scope data-name="${change.path}"`);
        let resultEL: kelement | null = null;
        if (addedEl) {
            resultEL = this.dom.loadElement(addedEl);
        }

        return resultEL;
    }

    remove(change: op) {
        super.remove(change);
        let el = this.dom.getBestMatchingElements(change.path) ?.pop();
        if (el) this.dom.removeElement(el);
    }

    /**
    * !!caution this is slow and overwrites the hole html of the $element
    * @param data 
    */
    render(change: op) {
        this.$el.innerHTML = change.value.map((e: any) => this.renderItem(change)).join("\r\n");
    }

    /**
     * 
     * @param value 
     */
    renderItem(change: any): string {
        let pointer = change.path?.split("/")?.pop();
        change.index = pointer;
        if (this.template) {
            let params = [change];
            for (let e in this.dom.store?.dataH?.store) {
                params.push(this.dom.store?.dataH?.store[e].data);
            }
            return this.template.apply(this, params);
        } else {
            return `<div data-type="list-item" data-index="${pointer}" data-name="${change.path}">${change.value}</div>`;
        }

    }

}