export class component {
    /**
     *
     * @param dom
     * @param store
     */
    constructor(dom, store) {
        var _a;
        this.dom = dom;
        this.store = store;
        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.dom.name, this.dom.name, "change", this.update);
    }
    set(path, value) {
    }
    get(path) {
    }
    update(changes) {
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            this.dom.getBestMatchingElements(change.path)
                .forEach((el) => el.update([change]));
        }
    }
}
