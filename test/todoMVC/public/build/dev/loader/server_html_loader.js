
import path from 'path';
const __dirname = path.resolve();

import { dataHandler } from '/home/akindziora/Downloads/projekte/radbod/build/dataHandler.js';
import { eventHandler } from '/home/akindziora/Downloads/projekte/radbod/build/eventHandler.js';
import { getFile } from '/home/akindziora/Downloads/projekte/radbod/test/todoMVC/config/routes.js';
import {_t} from './_t.js';


const base = __dirname + "/test/todoMVC/public/build/dev/";

const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next)

const enviroment = {
    data_loader: {
        find(options, cb) {
            setTimeout(() => cb.call({ dataH: {} }, { name: "test load asynchronous" }), 0);
        }
    }
};

export const html_loader = asyncHandler(async function (req, res, next) {

    function fetchData(component, cb, allready, total, meta) {

        let callback = function (meta) {
            return (data) => {
                cb(data);
                meta.cnt++;
                if (meta.cnt >= total) {
                    allready(dataH);
                }
            }
        };

        let result = component.data.call(dataH, callback(meta), {});

        if (typeof result.then !== "function") {
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

    let dataH = new dataHandler(new eventHandler(), enviroment);

    let path = req.path;
    
    let f = getFile(path);

    console.log(path, f);
    console.log(base + "page/" + f + ".js");

    let page = await import(base + "page/" + f + ".js");

    let count = countForData(page[f], 0);
    let met = { cnt: 0 };

    fetchData(page[f], (data) => {
    }, (stores) => {
        let renderedHTML = '';

        let storeData = stores.store.toArray();

        console.log(storeData);

        try { 
            renderedHTML = page[f].views[f].apply(null, [{ value: "" }, ...storeData, _t]);
        } catch (e) {

            console.log(renderedHTML, e);

        }

        res.send(renderedHTML);

        next();

    }, count, met);

});