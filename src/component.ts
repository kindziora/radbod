import { dom } from './dom.js';
import { store, op } from './store.js';
import { actions } from './actions.js';
import { dataHandler } from './dataHandler.js';

export class component {
    public dom: dom;
    public store: store;
    public name: string = "";
    private interactions: actions = {};

    public id: String;
    public $el: HTMLElement;

    /**
     * 
     * @param dom 
     * @param store 
     */
    constructor(dom: dom, store: store, acts: actions) {
        this.dom = dom;
        this.store = store;
        this.interactions = acts;
        this.name = this.dom.name;

        this.$el = dom._area;

        this.bindEvents();
    }

    getName() {
        return this.name;
    }


    setId(namesp: string | null, counter: number) {
        let id: string = namesp || "element" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    bindEvents() {
        //this.update.bind(this);

        this.store.events?.addEvent(this.name, "/", "change", this.update, this);
        this.store.events?.addEvent(this.store.name, "/", "change", this.update, this);

        this.store.events?.addEvent(this.name, "/", "change", this.interactions?.["/"]?.["change"], this);
        this.store.events?.addEvent(this.store.name, "/", "change", this.interactions?.["/"]?.["change"], this);

        for (let path in this.interactions) {

            for (let event in this.interactions[path]) {

                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');

                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[1]) {
                            this.store.events?.addEvent(this.name, path, event, this.interactions?.[path]?.[event]);

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

            let chs = this.dom.getBestMatchingElements(change.path);
            chs.forEach((el) => el.update([change]));

            if (chs.length === 0) {
                this.render(change);
            }
        }

    }

    render(changes: Array<op>) {
        console.log("COMPONENT UPDATE BECAUSE NO FIELD TO MATCH");
        this.dom.render(changes);
        this.bindEvents();
    }

    private fetchData(component: component, cb: Function, allready: Function, total: number, meta: object) {

        let callback = function (meta, dataH) {
            return (data) => {
                cb(data);
                meta.cnt++;
                meta.loaded.push(component);
                if (meta.cnt >= total) {
                    allready(dataH, meta);
                }
            }
        };

        let result = component.data.call(this.store.dataH, callback(meta, this.store.dataH), {});

        if (typeof result.then !== "function") {
            meta.cnt++;
            meta.loaded.push(component);
        }

        for (let i in component.components) {
            fetchData(component.components[i], cb, allready, total, meta);
        }

        if (meta.cnt >= total) {
            allready(this.store.dataH, meta);
        }
    }

    private countForData(component: component, cnt: number) {
        for (let i in component.components)
            cnt = this.countForData(component.components[i], cnt);
        return ++cnt;
    }

    public loadStores() {
        return this.dom.elementTypes;
    }


}