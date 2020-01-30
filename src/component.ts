import { dom } from './dom.js';
import { store, op } from './store.js';
import { actions } from './actions.js';

export class component {
    public dom: dom;
    public store: store;
    public name: string = "";
    private interactions: actions = {};
<<<<<<< HEAD
=======
    public id: String;
    public $el: HTMLElement;

>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
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
<<<<<<< HEAD
=======
        this.$el = dom._area;
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc

        this.bindEvents();
    }

    getName(){
        return this.name;
    }

<<<<<<< HEAD
=======
    setId(namesp: string | null, counter: number) {
        let id: string = namesp || "element" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }

>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
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

            if(chs.length === 0){
                this.render(change);
            }
        }

    }

    render(changes: Array<op>){
        console.log("COMPONENT UPDATE BECAUSE NO FIELD TO MATCH");
         this.dom.render(changes);
         this.bindEvents();
    }

}