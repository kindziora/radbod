export class component {
    /**
     *
     * @param dom
     * @param store
     */
    constructor(dom, store, acts) {
        var _a;
        this.name = "";
        this.interactions = {};
        this.dom = dom;
        this.store = store;
        this.interactions = acts;
        this.name = this.dom.name;
        this.$el = dom._area;
        this.bindEvents();
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.add(`/$${this.name}`, "post_render", this.bindByInteractions, this);
    }
    getName() {
        return this.name;
    }
    setId(namesp, counter) {
        let id = namesp || "e" + "-" + counter;
        this.$el.setAttribute("data-id", id);
        this.id = id;
    }
    bindEvents() {
        var _a, _b, _c, _d, _e;
        //this.update.bind(this);
        //wrong this context
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.add("/$" + this.store.name, "change", this.update, this);
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.add("/_state", "change", this.update, this);
        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.add("/$" + this.store.name, "change", (_e = (_d = this.interactions) === null || _d === void 0 ? void 0 : _d["/$" + this.store.name]) === null || _e === void 0 ? void 0 : _e["change"], this);
        this.bindNonDomInteractions();
        this.bindByInteractions({ change: {}, domScope: this.$el });
    }
    bindNonDomInteractions() {
        var _a, _b, _c;
        for (let path in this.interactions) {
            if (typeof this.dom.elementByName[path] === "undefined") {
                for (let event in this.interactions[path]) {
                    let name = this.store.unmaskComponentName(path, "/").split("/").shift();
                    (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.add(path, event, (_c = (_b = this.interactions) === null || _b === void 0 ? void 0 : _b[path]) === null || _c === void 0 ? void 0 : _c[event], this);
                }
            }
        }
    }
    bindByInteractions(meta) {
        var _a, _b, _c, _d, _e;
        let { change, domScope, readd } = meta;
        this.dom.loadElementsScoped(domScope);
        // ONLY ITERATE OVER FIELDS THAT ARE REALY IN SCOPE AND NOT FROM ANY SCOPE OVER ALL FIELDS!!!!!!!!!!!!!
        console.log("bindByInteractions", this.name, change, domScope);
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
                    let eventList = (_b = (_a = this.interactions) === null || _a === void 0 ? void 0 : _a[path]) === null || _b === void 0 ? void 0 : _b[event];
                    if (!Array.isArray(eventList)) {
                        eventList = [(_d = (_c = this.interactions) === null || _c === void 0 ? void 0 : _c[path]) === null || _d === void 0 ? void 0 : _d[event]];
                    }
                    for (let evt in eventList) {
                        let added = (_e = this.store.events) === null || _e === void 0 ? void 0 : _e.addByElement(this.name, $el, event, eventList[evt], this);
                        if (added || readd) {
                            let func = function (f, me, $el, event) {
                                return function (ev) {
                                    var _a;
                                    (_a = me.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(me.name, $el, event, { "field": f, ev }, me.store.data, me.interactions);
                                };
                            }(this.dom.elementByName[path][field], this, $el, event);
                            $el.addEventListener((mapEvent.length > 1 && fieldID === mapEvent[1]) ? mapEvent[0] : event, func);
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
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            let chs = this.dom.findMatchingElements(change.path);
            let store = this.store;
            let getArrayItemPath = this.dom.getArrayItemPath;
            chs.forEach(function (el) {
                let fieldPath = el.$el.getAttribute("data-name");
                if (change.path !== fieldPath && change.op !== "add") {
                    if (el.constructor.name !== "elist") {
                        let val = store.accessByPath(fieldPath); //get correct context/scope
                        return el.update([{ op: "replace", path: fieldPath, value: val }]);
                    }
                    else {
                        let itemPath = getArrayItemPath(change.path);
                        return el.update([{ op: "add", path: itemPath, value: store.accessByPath(itemPath) }]);
                    }
                }
                else {
                    return el.update([change]);
                }
            });
        }
    }
    render(changes) {
        console.log("COMPONENT UPDATE ??? BECAUSE NO FIELD TO MATCH");
        // this.dom.render(changes);
        //   let storeObject = this.store.dataH?.store.toObject();
        // this.store.events?.dispatchEvent(this.name, this.name, "post_render", { change: changes[0], domScope: this.$el }, storeObject);
        // this.bindEvents();
    }
}
