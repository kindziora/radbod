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

        this.store.events?.add(`/$${this.name}`, "post_render", this.bindByInteractions, this);

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
        this.store.events?.add("/$" + this.store.name, "change", this.update, this);

        this.store.events?.add("/_state", "change", this.update, this);

        this.store.events?.add("/$" + this.store.name, "change", this.interactions?.["/$" + this.store.name]?.["change"], this);

        this.bindNonDomInteractions();

        this.bindByInteractions({ change: {}, domScope: this.$el });
    }

    bindNonDomInteractions() {
        for (let path in this.interactions) {
         //   if (typeof this.dom.elementByName[path] === "undefined") {
                for (let event in this.interactions[path]) {
                    let name:string = this.store.unmaskComponentName(path, "/").split("/").shift(); 
                    this.store.events?.add( path, event, this.interactions?.[path]?.[event], this);
                }
         //   }
        }
    }
 

    bindByInteractions(meta: { change: object, domScope: object, readd?:boolean }) {
        let { change, domScope, readd } = meta;
        let loaded = this.dom.loadElementsScoped(domScope) || [];
        
        // ONLY ITERATE OVER FIELDS THAT ARE REALY IN SCOPE AND NOT FROM ANY SCOPE OVER ALL FIELDS!!!!!!!!!!!!!
        console.log("bindByInteractions", this.name, change, domScope);
       
         for(let t in loaded){
             
            let t_el = loaded[t];

            if(t_el.$el.hasAttribute("data-events")){
                let onEvents : string[] | null = t_el.$el.getAttribute("data-events")?.split(",");
               
                for(let events in onEvents){
                    let nameEvent = onEvents[events].split(":");
                    
                    if(typeof this.interactions[nameEvent[0]] !== "undefined" && typeof this.interactions[nameEvent[0]][nameEvent[1]] !== "undefined" ){
                        let added = this.store.events?.addByElement(this.name, t_el.$el, nameEvent[1], this.interactions[nameEvent[0]][nameEvent[1]], this);
                    
                        if (added || readd) {
                            let func = makeFunc(t_el, this, t_el.$el, nameEvent[1]);
                            t_el.$el.addEventListener(nameEvent[1], func);
                        }
                    }else{
                        console.log("No interaction callback found for: ", onEvents[events]);
                    }
                }  
            }
        }
        
        function makeFunc(f, me, $el, event){ 
            return function(ev){ 
                me.store.events?.dispatchEvent(me.name, $el, event, { "field": f, ev }, me.store.data, me.interactions);
            }
        }

        /**
         * @todo WeakMaps für events nutzen und $el als key
         * 
         */
        for (let path in this.interactions) {

            for (let event in this.interactions[path]) {

                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');
       
                    let eventList: Array<Function> = this.interactions?.[path]?.[event];
                    
                    if(!Array.isArray(eventList)){
                        eventList = [this.interactions?.[path]?.[event]];
                    }
                    
                    for(let evt in eventList){
                        let added = this.store.events?.addByElement(this.name, $el, event, eventList[evt], this);

                        if (added || readd) {
                            let eventName = (mapEvent.length > 1 && fieldID === mapEvent[1]) ?  mapEvent[0] : event;

                            let func = makeFunc(this.dom.elementByName[path][field], this, $el, event);

                            $el.addEventListener(eventName, func);
                        }
                    }

                }
            }
        }
        return false;
    }


    /**
     * 
     * nächste todos
     * garbage collection für elements mit hilfe von remove element und kelementBy$el, elementByName, element, events die auf elements matchen alles per event handling event "remove_element"
     * 
     * @param changes 
     */
    update(changes: Array<op>) {
        for (let i: number = 0; i < changes.length; i++) {
            let change: op = changes[i];

            let chs = this.dom.findMatchingElements(change.path);
            let store = this.store;
            let getArrayItemPath: Function = this.dom.getArrayItemPath;

            chs.forEach(function (el) {
                let fieldPath: string = el.$el.getAttribute("data-name");

                if (change.path !== fieldPath && change.op !=="add") {
                    if(el.constructor.name !== "elist") {
                        let val = store.accessByPath(fieldPath); //get correct context/scope
                        return el.update([{ op: "replace", path: fieldPath, value: val }]); 
                    }else{
                        let itemPath : string = getArrayItemPath(change.path);
                        let val : any = store.accessByPath(itemPath);
                        if(val)
                            return el.update([{ op: "add", path: itemPath, value: val }]);
                    }
                } else {
                    return el.update([change]);
                }
            });

            
        }

    }

    render(changes: Array<op>) {
        console.log("COMPONENT UPDATE ??? BECAUSE NO FIELD TO MATCH");
       
       // this.dom.render(changes);
     //   let storeObject = this.store.dataH?.store.toObject();
       // this.store.events?.dispatchEvent(this.name, this.name, "post_render", { change: changes[0], domScope: this.$el }, storeObject);

       // this.bindEvents();
    }

}