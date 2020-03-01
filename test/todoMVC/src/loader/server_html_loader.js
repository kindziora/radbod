import path from 'path';
import {i18n} from './_t.js';

const __dirname = path.resolve();
let base;
let config;
let dataHandler;
let eventHandler;
let getFile;
let mergeDeep;
let translations;
let internationalize = new i18n();

( async ()=> {
      base = __dirname + "/test/todoMVC/public/build/dev/";
    
      config = await import(__dirname + "/test/todoMVC/config/env.js");
    
      dataHandler = await import(`${config.settings.radbod_build}/dataHandler.js`);
      dataHandler = dataHandler.dataHandler;
      eventHandler = await import(`${config.settings.radbod_build}/eventHandler.js`);
      eventHandler = eventHandler.eventHandler;
      
      mergeDeep = await import(__dirname + `/server/merge.js`);

      mergeDeep = mergeDeep.mergeDeep;

      getFile = await import(__dirname + "/test/todoMVC/config/routes.js");
      getFile = getFile.getFile;

      translations = await import(__dirname + '/test/todoMVC/public/build/dev/i18n/app_translations.js');
      translations = translations.translations;

      internationalize.addTranslation(translations);

})();

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
    let layout  = await import(base + "layout/index.js");

    let count = countForData(page[f], 0);
    let met = { cnt: 0 };

    fetchData(page[f], (data) => {
    }, (stores) => {
        let renderedHTML = '';

        let _t = (text,lang) => internationalize._t(text,lang);
        let storeData = stores.store.toArray();
        try {
           let pageHTML = eval(`(${page[f].views[f].toString()})`).apply(null, [{ value: "" }, ...storeData]);
           let layoutStore = stores.createStore("index", {html : pageHTML});
           renderedHTML = eval(`(${layout.index.views.index.toString()})`).apply(null, [{ value: "" }, layoutStore.data]);
 
        } catch (e) {
            console.log(renderedHTML, e);
        }

        res.send(renderedHTML);

        next();

    }, count, met);

});