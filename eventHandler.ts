class eventHandler{
    public event: Object;

    construct(){

    }

    /**
     * 
     * @param component 
     * @param id 
     * @param name 
     * @param cb 
     */
    addEvent(component:string, id: string, name:string, cb: Function){

        if(typeof this.event[component] ==="undefined"){
            this.event[component] = {};
        }

        if(typeof this.event[component][id] ==="undefined"){
            this.event[component][id] = {};
        }

        if(typeof this.event[component][id][name] ==="undefined"){
            this.event[component][id][name] = [];
        }
        
        this.event[component][id][name].push(cb);
    }
}