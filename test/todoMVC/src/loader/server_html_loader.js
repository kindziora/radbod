import { dataHandler } from '../../../../build/dataHandler.js';
import { eventHandler } from '../../../../build/eventHandler.js';

import path from 'path';
import { routes } from '../../config/routes.js';

const __dirname = path.resolve();
const base = "/home/akindziora/projekte/radbod/test/todoMVC/public/build/dev/";

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
    
    console.log(path);

    let page = await import(base + "page/home.js");

    let count = countForData(page.home, 0);
    let met = { cnt: 0 };

    fetchData(page.home, (data) => {
    }, (stores) => {
        let renderedHTML = '';

        let storeData = stores.store.toArray();

        console.log(storeData);

        try {
            renderedHTML = page.home.views.home.apply(null, [{ value: "" }, ...storeData]);
        } catch (e) {
            console.log(renderedHTML, e);
        }
        res.send(renderedHTML);

        next();

    }, count, met);

});