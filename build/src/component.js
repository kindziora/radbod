export class component {
    /**
     *
     * @param dom
     * @param store
     */
    constructor(dom, store) {
        this.dom = dom;
        this.store = store;
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
