import { eventHandler } from './eventHandler.js';
import { dataHandler } from './dataHandler.js';

import path from 'path';
const __dirname = path.resolve();
const base = "/home/akindziora/Downloads/projekte/radbod/test/todoMVC/public/build/dev/";

export function html_loader(req, res, next){
    
    let page = import(base + "page/home.js").home;
  
    let dataH = new dataHandler(new eventHandler(), environment);

    //recursive fetching of component data

    fetchData(page, function(data){

        if(fetchedAll){
            let renderedHTML = page.views.home.apply(null, this.stores.toArray());

            console.log(data, renderedHTML);
        
            next(); 
        }
     
        
    });
    
    /**
     * 
     * @param {*} component 
     * @param {*} callback 
     * @param {*} allready 
     */
    function fetchData(component, callback, allready) {
        component.data.call(dataH, callback);
        for(let i in component.components){
            fetchData(component.components[i])
        }
       if(Object.keys(component.components).length === 0){
            allready(dataH);
       }
    }

   


}