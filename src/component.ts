import { domHandler } from './domHandler.js';
import { store, op } from './store.js';
import { actions } from './actions.js';

import { kelement } from './dom/element.js';

export class component {
    public dom: domHandler;
    public store: store;
    public name: string = "";
    private interactions: actions = {};
    /**
     * 
     * @param dom 
     * @param store 
     */
    constructor(dom: domHandler, store: store, acts: actions) {
        this.dom = dom;
        this.store = store;
        this.interactions = acts;
        this.name = this.dom.name;
        this.bindEvents();
    }

    bindEvents() {
        this.store.events?.addEvent(this.name, "/", "change", this.update.bind(this));
        this.store.events?.addEvent(this.store.name, "/", "change", this.update.bind(this));

        for (let path in this.interactions) {

            for (let event in this.interactions[path]) {

                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('~');

                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[0]) {
                            this.store.events?.addEvent(this.name, path, mapEvent[0], this.interactions?.[path]?.[event]);

                            $el.addEventListener(mapEvent[0], (ev) => {
                                this.store.events?.dispatchEvent(this.name, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                            });
                        }
                    } else {
                        this.store.events?.addEvent(this.name, path, event, this.interactions?.[path]?.[event]);

                        $el.addEventListener(event, (ev) => {
                            this.store.events?.dispatchEvent(this.name, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                        });
                    }

                }
            }
        }

    }

    update(changes: Array<op>) {
 
        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];
            this.dom.getBestMatchingElements(change.path)
            .forEach((el) => el.update([change]));
        }

    }




}