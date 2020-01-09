
/**
 * 
 * @param str 
 * @param seed 
 */
export const cyrb53 = function(str : string, seed = 0) : number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1>>>16, 2246822507) ^ Math.imul(h2 ^ h2>>>13, 3266489909);
    h2 = Math.imul(h2 ^ h2>>>16, 2246822507) ^ Math.imul(h1 ^ h1>>>13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

export interface meta { component: string, id: string, name: string };

export class eventHandler{

    public event: Object = {};
    public eventById: { [index: number]: Function} = {};

    construct(){

    }

    /**
     * 
     * @param cb 
     */
    addFunction(cb: Function, meta: meta): number{ 
        let id: number = cyrb53(cb.toString());
        
        this.eventById[id] = ((meta, eventHdlr) => (args:object = {}, returnValue = null) =>{
          
            returnValue = cb.apply(eventHdlr, [args, returnValue, meta]);

            return returnValue;
        })(meta, this);

        return id;
    }

    getFunction( id: number){
        return this.eventById[id];
    }

    removeEvent(callbackId : number){
        delete this.eventById[callbackId];
        //todo: cleanup named object
    }


    /**
     * 
     * @param component 
     * @param id 
     * @param name 
     * @param cb 
     */
    addEvent(component:string, id: string, name:string, cb: Function){

        let callbackId : number = this.addFunction(cb, {component, id, name});

        if(typeof this.event[component] === "undefined"){
            this.event[component] = {};
        }

        if(typeof this.event[component][id] === "undefined"){
            this.event[component][id] = {};
        }

        if(typeof this.event[component][id][name] === "undefined"){
            this.event[component][id][name] = [];
        }

        if(this.event[component][id][name].indexOf(callbackId) === -1)
            this.event[component][id][name].push(callbackId);

        return callbackId;
    }

    dispatchEvent(component:string, id: string, name:string, args = null, returnValue = null) {
        
        if (this.event[component]?.[id]?.[name]) {
            let ret = null || returnValue;

            let special = name.indexOf("pre_") > -1 || name.indexOf("post_") > -1;
    
            if(!special)
                ret = this.dispatchEvent(component, id, "pre_" + name, args, ret);

            for(let i in this.event[component][id][name]){
                let callbackID = this.event[component][id][name][i];
               
                ret = this.getFunction(callbackID)?.call(this, args, ret || ret);
                if(false === ret){
                    break;
                }
                
            }
            if(!special)
                ret = this.dispatchEvent(component,id, "post_" + name, args, ret);

            return ret;
        }else{
            console.log("no listener for ", component, id, name, args);
            return returnValue;
        }
    }

  
}