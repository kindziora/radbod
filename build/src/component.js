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
            if (typeof this.dom.elementByName[change.path] !== "undefined") {
                for (let i in this.dom.elementByName[change.path]) {
                    let el = this.dom.elementByName[change.path][i];
                    el.update([change]);
                }
            }
        }
    }
}
