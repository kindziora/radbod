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
            this.updateUntilParent(change, change.path);
        }
    }
    /**
     *
     * @param change
     * @param path
     */
    updateUntilParent(change, path) {
        if (typeof this.dom.elementByName[change.path] !== "undefined") {
            for (let i in this.dom.elementByName[change.path]) {
                let el = this.dom.elementByName[change.path][i];
                el.update([change]);
            }
        }
        else {
            let parentPath = path.split("/");
            parentPath.pop();
            this.updateUntilParent(change, parentPath.join('/'));
        }
    }
}
