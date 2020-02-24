
import path from 'path';

import { dataHandler } from '../../../../build/dataHandler.js';
import { eventHandler } from '../../../../build/eventHandler.js';


import { getFile } from '../../config/routes.js';

const __dirname = path.resolve();
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
            renderedHTML = page[f].views[f].apply(null, [{ value: "" }, ...storeData]);
        } catch (e) {

            console.log(renderedHTML, e);

        }

        renderedHTML

        res.send(renderedHTML);

        next();

    }, count, met);

});