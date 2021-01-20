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
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name, this.name, "post_render", this.bindByInteractions, this);
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        //this.update.bind(this);
        //wrong this context
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name, "/", "change", this.update, this);
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.addEvent(this.store.name, "/", "change", this.update, this);
        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.addEvent(this.name, "/", "change", (_e = (_d = this.interactions) === null || _d === void 0 ? void 0 : _d["/"]) === null || _e === void 0 ? void 0 : _e["change"], this);
        (_f = this.store.events) === null || _f === void 0 ? void 0 : _f.addEvent(this.store.name, "/", "change", (_h = (_g = this.interactions) === null || _g === void 0 ? void 0 : _g["/"]) === null || _h === void 0 ? void 0 : _h["change"], this);
        this.bindByInteractions({ change: {}, domScope: this.$el });
    }
    bindByInteractions(meta) {
        var _a, _b, _c, _d, _e, _f;
        let { change, domScope } = meta;
        this.dom.loadElementsScoped(domScope);
        // ONLY ITERATE OVER FIELDS THAT ARE REALY IN SCOPE AND NOT FROM ANY SCOPE OVER ALL FIELDS!!!!!!!!!!!!!
        console.log("bindByInteractions", this.name, change, domScope);
        for (let path in this.interactions) {
            for (let event in this.interactions[path]) {
                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');
                    let c = (ev) => {
                        var _a;
                        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name + `-${fieldID}`, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                    };
                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[1]) {
                            let added = (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name + `-${fieldID}`, path, event, (_c = (_b = this.interactions) === null || _b === void 0 ? void 0 : _b[path]) === null || _c === void 0 ? void 0 : _c[event]);
                            if (added) {
                                console.log("addEventListener", $el, this.name + `-${fieldID}`, mapEvent[0], path, event, "added");
                                $el.addEventListener(mapEvent[0], c);
                            }
                        }
                    }
                    else {
                        let added = (_d = this.store.events) === null || _d === void 0 ? void 0 : _d.addEvent(this.name + `-${fieldID}`, path, event, (_f = (_e = this.interactions) === null || _e === void 0 ? void 0 : _e[path]) === null || _f === void 0 ? void 0 : _f[event]);
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
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            let chs = this.dom.getBestMatchingElements(change.path);
            chs.forEach((el) => el.update([change]));
            if (chs.length === 0) {
                this.render(change);
            }
        }
    }
    render(changes) {
        var _a, _b;
        console.log("COMPONENT UPDATE BECAUSE NO FIELD TO MATCH");
        this.dom.render(changes);
        let storeObject = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toObject();
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(this.name, this.name, "post_render", { change: changes[0], domScope: this.$el }, storeObject);
        this.bindEvents();
    }
}
