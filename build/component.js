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
    bindEvents() {
        //this.update.bind(this);
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name, "/", "change", this.update, this);
        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.addEvent(this.store.name, "/", "change", this.update, this);
        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.addEvent(this.name, "/", "change", (_d = this.interactions) === null || _d === void 0 ? void 0 : _d["/"]["change"], this);
        (_e = this.store.events) === null || _e === void 0 ? void 0 : _e.addEvent(this.store.name, "/", "change", (_f = this.interactions) === null || _f === void 0 ? void 0 : _f["/"]["change"], this);
        for (let path in this.interactions) {
            for (let event in this.interactions[path]) {
                for (let field in this.dom.elementByName[path]) {
                    let $el = this.dom.elementByName[path][field].$el;
                    let fieldID = this.dom.elementByName[path][field].id;
                    let mapEvent = event.split('#');
                    if (mapEvent.length > 1) {
                        if (fieldID === mapEvent[1]) {
                            (_g = this.store.events) === null || _g === void 0 ? void 0 : _g.addEvent(this.name, path, event, (_j = (_h = this.interactions) === null || _h === void 0 ? void 0 : _h[path]) === null || _j === void 0 ? void 0 : _j[event]);
                            $el.addEventListener(mapEvent[0], (ev) => {
                                var _a;
                                (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name, path, event, { "field": this.dom.elementByName[path][field], ev }, this.store.data);
                            });
                        }
                    }
                    else {
                        (_k = this.store.events) === null || _k === void 0 ? void 0 : _k.addEvent(this.name, path, event, (_m = (_l = this.interactions) === null || _l === void 0 ? void 0 : _l[path]) === null || _m === void 0 ? void 0 : _m[event]);
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
