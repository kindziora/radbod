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
        return Array.from(this.$el?.children as HTMLCollection);
    }

    getListItems(cached: boolean = false) {
        return cached ? this._listItems : this.mapListItems();
    }

    mapListItems(): { [index: string]: kelement } | {} {
        let mappedItems: { [index: string]: kelement } = {};
        let items = this.getNativeListItems();
        for (let e in items) {

            let id = typeof items[e] !== "undefined" ? items[e]?.getAttribute("data-id") : "";

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
        this.render(change);
    }
/**
 * 
 * @TODO es fehlen teilweise elemente anch vielem hin und her geklicke
 * 
 */
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
            if (pos !== 0 && pos > Object.keys(items).length - 1) {
                where = "beforeend";
                this.dom.insertElementByElement(this, where, this.renderItem(change));
            }

            //inserted in between
            if (pos > 0 && pos < Object.keys(items).length - 1) {
                 
                function walkUntilFound(dir: number, where : string) {
                    let inserted: boolean = false;

                    for (let i = pos; i > 0; i = i + dir) {
                        let name: string = change.path.replace(/\d+(\D*)$/gm, i);

                        if (this._listItemsByName[name]) {
                            this.dom.insertElementByElement(this._listItemsByName[name], where, this.renderItem(change));
                            inserted = true;
                            break;
                        }
                    }
                    return inserted;
                }
 

                if(!walkUntilFound.call(this, -1, "afterend")){
                    walkUntilFound.call(this, 1, "afterend");
                }

            }

        } else {
            console.log("failed pointer from path", change.path);
        }
        let addedEl = this.$el.querySelector(`:scope [data-name="${CSS.escape(change.path)}"]`);
        let resultEL: kelement | null = null;
        if (addedEl) {
            this.dom.loadElementsScoped(addedEl); //not nessesary?
        }

        this.dom.store?.events?.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });

        return resultEL;
    }

    remove(change: op) {
        // super.remove(change);
        this.mapListItems();
        this.dom.removeElement(this._listItemsByName[change.path]);

        delete this._listItems[this._listItemsByName[change.path].id];
        delete this._listItemsByName[change.path];

    }

    /**
    * !!caution this is slow and overwrites the hole html of the $element
    * @param data 
    */
    render(change: op) {
        let items = JSON.parse(JSON.stringify(change.value || [])).filter((i: any) => !!i);
        this.$el.innerHTML = items.map((e: any, i: number) => this.renderItem({ op: "add", path: change.path + "/" + i, value: e })).join("\r\n").trim();
        this.dom.store?.events?.dispatchEvent(this.dom.name, `/$${this.dom.name}`, "post_render", { change: change, domScope: this.$el });
    }

    /**
     * 
     * @param value 
     */
    renderItem(change: any): string {
        let pointer = change.path?.split("/")?.pop();
        change.index = pointer;
        if (this.template) {
            let storeObject = this.dom.store?.dataH?.store.toObject();
            return this.template.call(this, { change, ...storeObject, _t: this.dom._t }).trim();
        } else {
            return `<div data-type="list-item" data-index="${pointer}" data-name="${change.path}">${change.value}</div>`;
        }

    }

}