import { dataHandler } from '../../../../build/dataHandler.js';
import { eventHandler } from '../../../../build/eventHandler.js';

import path from 'path';

const __dirname = path.resolve();
const base = "/home/akindziora/projekte/radbod/test/todoMVC/public/build/dev/";

const enviroment = {
    data_loader : {
        find(options, cb){
            setTimeout(() => cb({name: "test"}), 1000);
        }
    }

};


(async () => {

    function fetchData(component, cb, allready, total, meta) {
       
        let callback = function(meta){
            return (data)=> {
                cb(data);
                meta.cnt++;
                if (meta.cnt >= total) {
                    allready(dataH);
                }
            }
        };

        let result = component.data.call(dataH, callback(meta), {});

        if(typeof result.then !=="function"){
            meta.cnt++;
        } 
      
        for (let i in component.components) {
            fetchData(component.components[i], cb, allready, total, meta);
        }
        
        if (meta.cnt >= total) {
            allready(dataH);
        }
    }

    function countForData(component, cnt) {
        for (let i in component.components)
            cnt = countForData(component.components[i], cnt);
        return ++cnt;
    }

    let page = await import(base + "page/home.js");
    let dataH = new dataHandler(new eventHandler(), enviroment);
    let count = countForData(page.home, 0);
    let met = {cnt:0};

    fetchData(page.home, (data)=>{
    } , (stores)=>{
        console.log(stores);
    }, count, met);

    console.log(count);
})();




export function html_loader(req, res, next) {



    //recursive fetching of component data
    /**
        fetchData(page, function(data){
    
            if(fetchedAll){
                let renderedHTML = page.views.home.apply(null, this.stores.toArray());
    
                console.log(data, renderedHTML);
            
                next(); 
            }
         
            
        });
        
         */




}