;
export class datastore {
    constructor() {
        this._mounted = {};
        this.alias = {};
        this._changes = {};
        this.data = {};
    }
    construct() {
    }
    /**
     *
     * @param value
     */
    clone(value) {
        return typeof value !== "undefined" ? JSON.parse(JSON.stringify(value)) : value;
    }
    /**
     *
     * @param id
     * @param _component
     * @param subscriber
     */
    addInterface(id, _component) {
        this._mounted[id] = { _component, subscriber: [] };
        this._changes[id] = [];
        if (_component.parameters && _component.parameters.mapTo) {
            if (typeof this.alias[_component.parameters.mapTo] === "undefined") {
                this.alias[_component.parameters.mapTo] = [];
            }
            this.data[_component.parameters.mapTo] = _component.model.field;
            for (let a in this.data[id])
                this.getStore(a, this.clone(this.data[id][a]));
            this.alias[_component.parameters.mapTo].push(id);
        }
        this.data[id] = _component.model.field;
        for (let a in this.data[id]) {
            if (this.data[id][a])
                this.getStore(a, this.clone(this.data[id][a])); //BUUUUUG
        }
        return this;
    }
    /**
     *
     * @param name
     * @param def
     */
    getStore(name, def = {}) {
        if (typeof this.data[name] === "undefined") {
            this.data[name] = def;
        }
        return this.data[name];
    }
    /**
     *
     * @param id
     * @param subscriber
     */
    setSubscriber(id, subscriber = []) {
        this._mounted[id].subscriber = subscriber;
        return this;
    }
    /**
     *
     * @param id
     */
    removeInterface(id) {
        delete this._mounted[id];
        delete this._changes[id];
        return this;
    }
    /**
     *
     * @param _component
     * @param changes
     * @param idFrom
     * @param idTo
     * @param reverse
     */
    notify(_component, changes, idFrom, idTo, reverse = false) {
        let changeOrders = [];
        let idOrg = idTo;
        for (let c in changes.all) {
            let notation = changes.all[c][0];
            //let type = changes.all[c][1];
            //let pre = changes.all[c][2];
            let after = changes.all[c][3];
            let alias = false;
            let clear = _component.dom.normalizeChangeResponse(notation);
            if (_component.parameters && _component.parameters.mapTo) {
                alias = _component.parameters.mapTo;
            }
            if (reverse) {
                if (this._mounted[idFrom] && this._mounted[idFrom]._component.parameters && this._mounted[idFrom]._component.parameters.mapTo) {
                    alias = this._mounted[idFrom]._component.parameters.mapTo;
                }
                if (alias) {
                    idFrom = alias;
                }
                clear = `${idFrom}.${clear}`;
                changeOrders.push([idFrom, idTo, clear, after]);
                _component.set(clear, after);
            }
            else {
                if (clear.indexOf(alias) !== -1) {
                    idTo = alias;
                }
                if (clear.indexOf(idTo) !== -1) {
                    let clearC = _component.dom.normalizeChangeResponse(clear.replace(idTo + ".", ""));
                    changeOrders.push([idFrom, idTo, clear, after]);
                    _component.set(clearC, after);
                }
            }
        }
        this._changes[idOrg].push(...changeOrders);
    }
    onChange(id, changes) {
        console.log(`datastore change ${id} `, changes);
        //reverse lookup
        for (let other in this._mounted) {
            //   if(other === id)continue;
            let subscriber = this._mounted[other].subscriber.indexOf(id);
            if (subscriber !== -1) {
                this.notify(this._mounted[other]._component, changes, id, other, true);
            }
        }
        for (let i in this._mounted[id].subscriber) {
            let _componentsToCall = this._mounted[this._mounted[id].subscriber[i]]._component;
            this.notify(_componentsToCall, changes, id, this._mounted[id].subscriber[i], false);
        }
    }
}
