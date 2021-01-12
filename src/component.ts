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

        this.store.events?.addEvent(this.name, this.name, "post_render", this.bindByInteractions, this);

    }

    getName() {
        return this.name;
    }


    setId(namesp: string | null, counter: number) {
        let id: string = namesp || "e" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

    bindEvents() {
        //this.update.bind(this);
        //wrong this context
        this.store.events?.addEvent(this.name, "/", "change", this.update, this);
        this.store.events?.addEvent(this.store.name, "/", "change", this.update, this);

        this.store.events?.addEvent(this.name, "/", "change", this.interactions?.["/"]?.["change"], this);
        this.store.events?.addEvent(this.store.name, "/", "change", this.interactions?.["/"]?.["change"], this);

        this.bindByInteractions({ change: {}, domScope: this.$el });
    }

    bindByInteractions(meta: { change: object, domScope: object }) {
        let { change, domScope } = meta;
        // ONLY ITERATE OVER FIELDS THAT ARE REALY IN SCOPE AND NOT FROM ANY SCOPE OVER ALL FIELDS!!!!!!!!!!!!!
        console.log("bindByInteractions", this.name, change, domScope);

        for (let path in this.interactions) {

            for (let event in this.interactions[path]) {

                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');
                    let c = (ev) => {
                        this.store.events?.dispatchEvent(this.name + `-${fieldID}`, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                    };
                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[1]) {
                            let added = this.store.events?.addEvent(this.name + `-${fieldID}`, path, event, this.interactions?.[path]?.[event]);

                            if (added) {
                                console.log("addEventListener", $el, this.name + `-${fieldID}`, mapEvent[0], path, event, "added");
                                $el.addEventListener(mapEvent[0], c);
                            }

                        }
                    } else {
                        let added = this.store.events?.addEvent(this.name + `-${fieldID}`, path, event, this.interactions?.[path]?.[event]);

                        if (added) {
                            $el.addEventListener(event, c);
                            console.log("addEventListener", $el, this.name + `-${fieldID}`, event, path, "added");
                        }
                    }

                }
            }
        }
        return false;
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

}