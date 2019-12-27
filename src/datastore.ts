export * from '../node_modules/fast-json-patch/index.js';
export interface op { op: string, path: string, value: any };

export class datastore {
    private _mounted: Object = {};
    public alias: Object = {};
    private _changes: Object = {};
    public data: Object = {};

    construct() {

    }
    /**
     * 
     * @param value 
     */
    clone(value : any){
        return typeof value !=="undefined" ? JSON.parse(JSON.stringify(value)) : value;
    }

    /**
     * 
     * @param id 
     * @param _component 
     * @param subscriber 
     */
    public addInterface(id: string, _component: Object) {
        this._mounted[id] = { _component, subscriber: [] };
        this._changes[id] = [];
        if (_component.parameters && _component.parameters.mapTo) {

            if (typeof this.alias[_component.parameters.mapTo] === "undefined") {
                this.alias[_component.parameters.mapTo] = [];
            }
            this.data[_component.parameters.mapTo] = _component.model.field;
            for(let a in this.data[id])
                this.getStore(a, this.clone(this.data[id][a]));

            this.alias[_component.parameters.mapTo].push(id);
        }
        this.data[id] = _component.model.field;
        
        for(let a in this.data[id]){
            if(this.data[id][a])
                this.getStore(a, this.clone(this.data[id][a])); //BUUUUUG
        }

        return this;
    }
    /**
     * 
     * @param name 
     * @param def 
     */
    public getStore(name: string, def: Object = {}){
         
        if(typeof this.data[name] === "undefined"){
            this.data[name] = def;
        }

        return this.data[name];
    }

    /**
     * 
     * @param id 
     * @param subscriber 
     */
    public setSubscriber(id: string, subscriber: Array<string> = []) {
        this._mounted[id].subscriber = subscriber;
        return this;
    }

    /**
     * 
     * @param id 
     */
    public removeInterface(id: string) {
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
    private notify(_component: Object, changes: Object, idFrom: string, idTo: string, reverse: boolean = false) {
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

            } else {

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
    
    public onChange(id: string, changes: Object) {
 
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