export class component {
    /**
     *
     * @param dom
     * @param store
     */
    constructor(dom, store, acts) {
        this.name = "";
        this.interactions = {};
        this.dom = dom;
        this.store = store;
        this.interactions = acts;
        this.name = this.dom.name;
        this.bindEvents();
    }
    getName() {
        return this.name;
    }
    bindEvents() {
        //this.update.bind(this);
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name, "/", "change", this.update, this);
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.addEvent(this.store.name, "/", "change", this.update, this);
        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.addEvent(this.name, "/", "change", (_e = (_d = this.interactions) === null || _d === void 0 ? void 0 : _d["/"]) === null || _e === void 0 ? void 0 : _e["change"], this);
        (_f = this.store.events) === null || _f === void 0 ? void 0 : _f.addEvent(this.store.name, "/", "change", (_h = (_g = this.interactions) === null || _g === void 0 ? void 0 : _g["/"]) === null || _h === void 0 ? void 0 : _h["change"], this);
        for (let path in this.interactions) {
            for (let event in this.interactions[path]) {
                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');
                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[1]) {
                            (_j = this.store.events) === null || _j === void 0 ? void 0 : _j.addEvent(this.name, path, event, (_l = (_k = this.interactions) === null || _k === void 0 ? void 0 : _k[path]) === null || _l === void 0 ? void 0 : _l[event]);
                            $el.addEventListener(mapEvent[0], (ev) => {
                                var _a;
                                (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                            });
                        }
                    }
                    else {
                        (_m = this.store.events) === null || _m === void 0 ? void 0 : _m.addEvent(this.name, path, event, (_p = (_o = this.interactions) === null || _o === void 0 ? void 0 : _o[path]) === null || _p === void 0 ? void 0 : _p[event]);
                        $el.addEventListener(event, (ev) => {
                            var _a;
                            (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                        });
                    }
                }
            }
        }
    }
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            this.dom.getBestMatchingElements(change.path)
                .forEach((el) => el.update([change]));
        }
    }
}
