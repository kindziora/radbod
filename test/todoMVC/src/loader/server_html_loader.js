 
import { i18n } from './_t.js';
import { 
    dataHandler,
    eventHandler, 
    getFile,
    translations,
    settings
} from "../../config/env.js";

import { promises as fs } from 'fs';


let internationalize = new i18n();
internationalize.addTranslation(translations);

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

function fetchData(component, cb, allready, total, meta, dataH) {

    let callback = function (meta) {
        return (data) => {
            cb(data);
            meta.cnt++;
            meta.loaded.push(component);
            if (meta.cnt >= total) {
                allready(dataH, meta);
            }
        }
    };

    let result = component.data.call(dataH, callback(meta), {});

    if (typeof result.then !== "function") {
        meta.cnt++;
        meta.loaded.push(component);
    }

    for (let i in component.components) {
        fetchData(component.components[i], cb, allready, total, meta, dataH);
    }

    if (meta.cnt >= total) {
        allready(dataH, meta);
    }
}

function countForData(component, cnt) {
    for (let i in component.components)
        cnt = countForData(component.components[i], cnt);
    return ++cnt;
}

function getModules(meta){
    let mod = (e)=> `<script type="module" src="${e.path}"></script>`;
    meta.loaded.push({path:"/app.js"});
    return meta.loaded.map(mod).join("\n\r");
}

 

function getCSS(meta){
    
}

export const html_loader = asyncHandler(async function (req, res, next) {

    let dataH = new dataHandler(new eventHandler(), enviroment);

    let path = req.path;

    let f = getFile(path);

    console.log(settings.project_path + "public/build/dev/page/" + f + ".js");

    let page = await import(settings.project_path + "public/build/dev/page/" + f + ".js");
    
    let layout = await fs.readFile(settings.project_path + "src/layout/index.html", 'utf8');

    let count = countForData(page[f], 0);
    let met = { cnt: 0, loaded: [] };

    let RADBODINLINE = await fs.readFile(settings.radbod_build.replace("build", "dist") + "/radbod.js", 'utf8');

    fetchData(page[f], (data) => {

        console.log(data);

    }, (stores, meta) => { 

        let renderedHTML = '';

        let _t = (text, lang) => internationalize._t(text, lang);
        let storeData = stores.store.toArray();
        try {
            let pageHTML = eval(`(${page[f].views[f].toString()})`).apply(null, [{ value: "" }, ...storeData]);

            let layoutStore = stores.createStore("index", {
                 html: pageHTML,
                 js : getModules(meta),
                 css : getCSS(meta),
                 env: {language :"en_EN"},
                 head: "",
                 radbod : RADBODINLINE
            });

            renderedHTML = eval("(( index )=>`" + layout + "`)").apply(null, [layoutStore.data]);

        } catch (e) {
            console.log(renderedHTML, e);
        }

        res.send(renderedHTML);

        next();

    }, count, met, dataH);

});